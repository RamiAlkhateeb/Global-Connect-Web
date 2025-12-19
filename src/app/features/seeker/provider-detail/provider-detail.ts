import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-provider-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div class="container mt-4 pb-5">
      @if (provider) {
        <div class="mb-4">
          <a routerLink="/search" class="text-decoration-none text-muted mb-2 d-inline-block">
            &larr; Back to Search
          </a>
          <h2 class="fw-bold">{{ provider.name }}</h2>
          <span class="badge bg-primary me-2">{{ provider.specialty }}</span>
          <span class="text-muted">\${{ provider.hourlyRateUSD }}/hr</span>
          <p class="mt-3 text-muted">{{ provider.description }}</p>
        </div>

        <hr>

        <h4 class="mb-3">Select a Time</h4>
        
        <div class="row g-2">
          @for (slot of slots; track slot.slotId) {
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <button 
                class="btn w-100 py-3" 
                [ngClass]="slot.isBooked ? 'btn-secondary' : 'btn-outline-success'"
                [disabled]="slot.isBooked"
                (click)="bookSlot(slot)">
                
                <div class="fw-bold">{{ slot.startUTC | date:'HH:mm' }}</div>
                <div class="small" style="font-size: 0.75rem;">{{ slot.startUTC | date:'MMM d' }}</div>
              </button>
            </div>
          } @empty {
            <div class="col-12 alert alert-warning">
              No available slots found for this provider.
            </div>
          }
        </div>
      } @else {
        @if (error) {
          <div class="container mt-4">
            <div class="alert alert-danger">
              <h5>Error Loading Provider</h5>
              <p>{{ error }}</p>
              <small class="text-muted d-block mt-2">Check the browser console for more details.</small>
            </div>
          </div>
        } @else {
          <div class="container text-center py-5">
            <p class="text-muted">Loading provider details...</p>
          </div>
        }
      }
    </div>
  `
})
export class ProviderDetailComponent implements OnInit {
  // Use explicit types to help the compiler
  provider: any = null;
  slots: any[] = [];
  isLoading = false;
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
    const today = new Date().toISOString().split('T')[0];
    const url = `${environment.apiUrl}/availability/${id}/slots?SeekerTimezoneId=America/New_York`;
    console.log('Fetching slots from:', url);

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        console.log('Slots Received:', data);
        this.slots = data;
        this.isLoading = false;
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
}