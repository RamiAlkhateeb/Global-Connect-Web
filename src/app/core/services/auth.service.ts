import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // Ensure this matches your .NET launchSettings.json (usually 5000 or 7000)
  private apiUrl = 'https://localhost:7143/api/auth'; 

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, { idToken }).pipe(
      tap((response: any) => {
        // Save the JWT from your Backend
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
      })
    );
  }

  logout() {
    localStorage.clear();
  }
}