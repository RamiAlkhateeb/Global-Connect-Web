import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


// Interface for our new grouped data structure
interface DailySlots {
  dateStr: string;     // Used as unique key (e.g., '12/01/2023')
  displayDate: Date;   // Used for tab label formatting
  slots: any[];        // The actual slots for this day
}


@Component({
  selector: 'app-provider-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `<div class="container mt-4 pb-5">
      
      @if (provider) {
        <div class="card border-0 shadow-sm mb-4 animate-fade-in overflow-hidden">
          <div class="row g-0">
             <div class="col-md-3 col-4 bg-light d-flex align-items-center justify-content-center p-3">
                <img src="https://placehold.co/250x250/e9ecef/adb5bd?text={{getInitials(provider.name)}}" 
                     class="img-fluid rounded-circle shadow-sm border" 
                     alt="{{provider.name}}"
                     style="width: 120px; height: 120px; object-fit: cover;">
            </div>
            <div class="col-md-9 col-8">
              <div class="card-body py-3">
                <a routerLink="/search" class="text-decoration-none text-muted small mb-2 d-inline-block">
                  <i class="bi bi-arrow-left"></i> Back
                </a>
                <h2 class="fw-bold mb-1">{{ provider.name }}</h2>
                <div class="mb-3">
                  <span class="badge bg-primary me-2">{{ provider.specialty }}</span>
                  <span class="fw-bold">\${{ provider.hourlyRateUSD }}/hr</span>
                </div>
                <p class="text-muted small d-none d-md-block">{{ provider.description }}</p>
              </div>
            </div>
             <div class="col-12 d-md-none px-3 pb-3">
               <p class="text-muted small mb-0">{{ provider.description }}</p>
            </div>
          </div>
        </div>

        <h5 class="mb-3 fw-bold">Select Appointment Time</h5>
        <p class="text-muted small"><i class="bi bi-clock"></i> Times shown in your local timezone.</p>
        
        @if (groupedSlots.length > 0) {
          <ul class="nav nav-tabs nav-fill mb-3 flex-nowrap overflow-auto pb-1" id="slotTabs" role="tablist">
            @for (group of groupedSlots; track group.dateStr; let i = $index) {
              <li class="nav-item" role="presentation">
                <button class="nav-link text-nowrap px-3 py-2 small" 
                        [class.active]="i === selectedTabIndex"
                        id="tab-{{i}}" 
                        (click)="selectedTabIndex = i"
                        type="button" role="tab">
                  <div class="fw-bold">{{ group.displayDate | date:'EEE' }}</div>
                  <div>{{ group.displayDate | date:'MMM d' }}</div>
                </button>
              </li>
            }
          </ul>

          <div class="tab-content" id="slotTabsContent">
            @for (group of groupedSlots; track group.dateStr; let i = $index) {
              <div class="tab-pane fade" [class.show]="i === selectedTabIndex" [class.active]="i === selectedTabIndex" role="tabpanel">
                 
                <div class="row g-2">
                  @for (slot of group.slots; track slot.slotId) {
                    <div class="col-4 col-sm-3 col-md-2">
                      <button 
                        class="btn w-100 py-2" 
                        [ngClass]="slot.isBooked ? 'btn-light text-muted border-0' : 'btn-outline-primary fw-semibold'"
                        [disabled]="slot.isBooked"
                        (click)="bookSlot(slot)">
                        {{ slot.startUTC | date:'HH:mm' }}
                      </button>
                    </div>
                  }
                </div>

              </div>
            }
          </div>
        } @else {
           @if (!isLoading) {
             <div class="alert alert-info">
               No availability found for the next 7 days.
             </div>
           }
        }

      } @else {
        <div class="container text-center py-5 mt-5">
          <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status"></div>
          <p class="text-muted">Loading provider details...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    /* Ensure tabs don't wrap awkwardly on small screens */
    .nav-tabs .nav-link { border-bottom-width: 3px; border-radius: 0; color: #6c757d; }
    .nav-tabs .nav-link.active { color: #0d6efd; border-bottom-color: #0d6efd; background: transparent; }
    /* Hide scrollbar for cleaner look */
    .overflow-auto::-webkit-scrollbar { display: none; }
    .overflow-auto { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class ProviderDetailComponent implements OnInit {
  // Use explicit types to help the compiler
  provider: any = null;
  slots: any[] = [];
  isLoading = false;
  groupedSlots: DailySlots[] = [];
  selectedTabIndex = 0; // Tracks active tab
  error = '';

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // BUG FIX: Use paramMap.get('id') and ensure it's converted to number if your API expects it
    // Using subscribe here is safer than snapshot if the user navigates between providers
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('Target Provider ID:', id);
        this.provider = null; // Reset on route change
        this.groupedSlots = [];
        this.loadProviderDetails(id);
        this.loadSlots(id);
      } else {
        this.error = 'No provider ID found in route';
      }
    });
  }

  loadProviderDetails(id: string) {
    const url = `${environment.apiUrl}/providers/${id}`;
    console.log('Fetching provider from:', url);

    this.http.get<any>(url).subscribe({
      next: (data) => {
        console.log('Provider Data Received:', data);
        this.provider = data;
        this.error = '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Provider API Error:', err);
        this.error = `Failed to load provider: ${err.status} ${err.statusText}`;
        this.cdr.markForCheck();
      }
    });
  }

  loadSlots(id: string) {
    this.isLoading = true;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const startStr = today.toISOString().split('T')[0];
    const endStr = nextWeek.toISOString().split('T')[0];
    const url = `${environment.apiUrl}/availability/${id}/slots?SeekerTimezoneId=America/New_York`;
    console.log('Fetching slots from:', url);

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        console.log('Slots Received:', data);
        this.slots = data;
        this.groupSlotsByDay(data);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Slots API Error:', err);
        this.error = `Failed to load slots: ${err.status} ${err.statusText}`;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  bookSlot(slot: any) {
    this.http.post(`${environment.apiUrl}/bookings`, {
      slotId: slot.slotId,
      paymentToken: "tok_visa_success_9988"
    }).subscribe({
      next: () => {
        alert('Booked successfully!');
        // Reload the page to refresh slot availability
        window.location.reload();
      },
      error: (err) => alert(err.error?.message || 'Error booking slot')
    });
  }

  // NEW: Helper function to organize the flat list of slots by local date
  private groupSlotsByDay(flatSlots: any[]) {
    const groups = new Map<string, DailySlots>();

    for (const slot of flatSlots) {
      // 1. Create a Date object from UTC string
      const dateObj = new Date(slot.startUTC);
      // 2. Get localized date string to use as a grouping key (e.g., "12/25/2023")
      // This ensures slots on the same local day end up together
      const dateKey = dateObj.toLocaleDateString();

      if (!groups.has(dateKey)) {
        groups.set(dateKey, {
          dateStr: dateKey,
          displayDate: dateObj, // Keep object for DatePipe formatting in template
          slots: []
        });
      }
      groups.get(dateKey)!.slots.push(slot);
    }

    // Convert Map to Array and sort by date to ensure tabs are in order
    this.groupedSlots = Array.from(groups.values())
      .sort((a, b) => a.displayDate.getTime() - b.displayDate.getTime());
    
    // Reset to first tab whenever new data loads
    if (this.groupedSlots.length > 0) {
        this.selectedTabIndex = 0;
    }
  }

  // Helper to generate initials for the placeholder image
  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'PV';
  }
}