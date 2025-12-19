// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Holds current user state
  currentUser$ = new BehaviorSubject<any>(null);

  constructor() {
    this.loadUserFromToken();
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: {email: string, password: string}) {
    console.log('Attempting login to:', `${this.apiUrl}/login`, credentials); // <--- Add this
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.loadUserFromToken();
      })
    );
  }

  private loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.currentUser$.next(decoded);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser$.next(null);
  }
}