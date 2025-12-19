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
      <h3 class="mb-4">Find a Specialist</h3>
      
      <div class="row g-2 mb-4">
        <div class="col-12 col-md-6">
          <input type="text" class="form-control" placeholder="Search by specialty (e.g., Therapist)">
        </div>
        <div class="col-12 col-md-3">
           <button class="btn btn-primary w-100" (click)="loadProviders()">Search</button>
        </div>
      </div>

      <div class="row">
        <div *ngFor="let p of providers" class="col-12 col-md-6 col-lg-4 mb-3">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                   <h5 class="card-title fw-bold text-primary">{{ p.name }}</h5>
                   <h6 class="card-subtitle mb-2 text-muted">{{ p.specialty }}</h6>
                </div>
                <span class="badge bg-light text-dark">\${{ p.hourlyRateUSD }}/hr</span>
              </div>
              
              <p class="card-text mt-3 small">
                <i class="bi bi-globe"></i> {{ p.languages?.join(', ') || 'English' }}
              </p>
              
              <div class="d-grid mt-3">
                <a [routerLink]="['/provider', p.providerId]" class="btn btn-outline-primary">
                  View Availability
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="providers.length === 0" class="col-12 text-center text-muted mt-5">
          <p>No providers found. Try adjusting your filters.</p>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit {
  providers: any[] = [];
  private http = inject(HttpClient);

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    // Calling the GET /api/providers/search endpoint
    this.http.get<any>(`${environment.apiUrl}/providers`).subscribe({
      next: (res) => {
        // The API returns { totalResults: 45, providers: [...] }
        this.providers = res || [];
      },
      error: (err) => console.error('Failed to load providers', err)
    });
  }
}