import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7143/api/booking';

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // We send the Google Access Token to the backend
  syncGoogleCalendar(accessToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sync`, { accessToken });
  }
}