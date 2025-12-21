// src/app/features/seeker/search/search.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // needed for *ngFor
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router'; // <--- STEP 1: Import this
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-search',
  standalone: true, // <--- STEP 2: Verify this line exists
  imports: [
    CommonModule,
    RouterLink    // <--- STEP 3: Ensure it is listed here!
  ],
  template: `<div class="container mt-4 pb-5">
      <h3 class="mb-4 fw-bold">Find a Specialist</h3>
      
      <div class="row g-2 mb-4">
        <div class="col-12 col-md-8">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-start-0 ps-0" placeholder="Try 'Therapist' or 'German'">
          </div>
        </div>
        <div class="col-12 col-md-4">
           <button class="btn btn-primary w-100 fw-semibold" (click)="loadProviders()">Search</button>
        </div>
      </div>

      <div class="row g-3">
        @for (p of providers; track p.providerId) {
        <div class="col-12 col-lg-6">
          <div class="card h-100 shadow-sm border-0 overflow-hidden">
            <div class="row g-0 h-100">
              <div class="col-4 col-sm-3 bg-light d-flex align-items-center justify-content-center p-2">
                <img src="https://placehold.co/200x200/e9ecef/adb5bd?text={{getInitials(p.name)}}" 
                     class="img-fluid rounded-circle border shadow-sm" 
                     alt="{{p.name}}"
                     style="width: 80px; height: 80px; object-fit: cover;">
              </div>
              
              <div class="col-8 col-sm-9">
                <div class="card-body d-flex flex-column h-100 py-3 pe-3 ps-0">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                       <h5 class="card-title fw-bold text-dark mb-1">{{ p.name }}</h5>
                       <span class="badge bg-primary-subtle text-primary-emphasis">{{ p.specialty }}</span>
                    </div>
                    <div class="text-end">
                      <span class="fs-5 fw-bold text-dark">\${{ p.hourlyRateUSD }}</span>
                      <small class="text-muted d-block">/ hr</small>
                    </div>
                  </div>
                  
                  <p class="card-text text-muted small mb-3 flex-grow-1 text-truncate" style="max-height: 40px;">
                    <i class="bi bi-translate me-1"></i> {{ p.languages?.join(', ') || 'English' }}
                  </p>
                  
                  <a [routerLink]="['/provider', p.providerId]" class="btn btn-outline-primary btn-sm fw-semibold stretched-link">
                    View Availability
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        } @empty {
          <div class="col-12 text-center text-muted mt-5 py-5">
            <i class="bi bi-people fs-1 mb-3 d-block"></i>
            <p class="fs-5">No providers found matching criteria.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .stretched-link::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      content: "";
    }
    // Ensure relative positioning for the stretched link to work relative to the card
    .card { position: relative; }
  `]
})
export class SearchComponent implements OnInit {
  providers: any[] = [];
  private http = inject(HttpClient);

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    this.http.get<any>(`${environment.apiUrl}/providers`).subscribe({
      next: (res) => this.providers = res || [],
      error: (err) => console.error('Failed to load providers', err)
    });
  }

  // Helper to generate initials for the placeholder image
  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'PV';
  }
}