import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Language {
  id: number;
  name: string;
}

export interface ProviderProfile {
  bio: string;
  specialty: string;
  name: string;
  hourlyRateUSD: number;
  nationality: string;
  googleBookingUrl: string;
  languageIds: number[];
}

// Add this interface
export interface ProviderSummary {
  providerId: number;
  name: string;
  specialty: string;
  nationality: string;
  photoUrl?: string;
  hourlyRateUSD: number;
  bio: string;
  googleBookingUrl: string;
  languages: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7143/api/providers'; // Check port

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.apiUrl}/languages`);
  }

  getMyProfile(): Observable<ProviderProfile> {
    return this.http.get<ProviderProfile>(`${this.apiUrl}/my-profile`);
  }

  updateProfile(data: ProviderProfile): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data);
  }

  // Inside the class, add this method
  // Note: Check if your controller route is 'api/provider' or 'api/providers'
  searchProviders(query: string = ''): Observable<ProviderSummary[]> {
    // Debug the URL being called
    const url = `${this.apiUrl}?query=${query}`; 
    console.log('Calling API:', url);
    return this.http.get<ProviderSummary[]>(url);
  }
}   