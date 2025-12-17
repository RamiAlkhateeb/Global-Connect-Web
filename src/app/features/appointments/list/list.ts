// src/app/features/appointments/list/list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>My Appointments</h2>
      <div *ngIf="appointments.length === 0" class="alert alert-info">No upcoming appointments.</div>
      
      <div class="list-group">
        <div *ngFor="let appt of appointments" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-0">{{appt.otherPartyName}}</h6>
            <small class="text-muted">{{appt.startTimeUTC | date:'fullDate'}} at {{appt.startTimeUTC | date:'shortTime'}}</small>
            <span class="badge bg-success ms-2">{{appt.status}}</span>
          </div>
          <a [href]="appt.joinLink" target="_blank" class="btn btn-sm btn-primary">Join Call</a>
        </div>
      </div>
    </div>
  `
})
export class ListComponent implements OnInit {
  appointments: any[] = [];
  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/bookings/my-appointments`).subscribe(res => {
      this.appointments = res;
    });
  }
}