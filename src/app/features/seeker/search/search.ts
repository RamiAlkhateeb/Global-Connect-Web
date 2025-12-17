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
  template: `
    <div class="container mt-4">
      <h3>Find a Provider</h3>
      <div class="row g-3 mb-4">
        <div class="col-md-5">
          <input type="text" class="form-control" placeholder="Search by specialty..." (input)="onFilter($event)">
        </div>
      </div>

      <div class="row">
        <div *ngFor="let p of providers" class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{p.name}}</h5>
              <p class="text-muted">{{p.specialty}}</p>
              <p><strong>Rate:</strong> {{p.hourlyRateUSD | currency}}</p>
              
              <button 
                class="btn btn-outline-primary btn-sm" 
                [routerLink]="['/booking', p.providerId]">
                Book Slot
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit {
  providers: any[] = [];
  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/availability/search?seekerTimezoneId=Europe/London`).subscribe(res => {
      this.providers = res.providers;
    });
  }

  onFilter(event: any) {
    // Filter logic placeholder
  }
}