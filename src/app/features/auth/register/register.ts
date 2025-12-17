// src/app/features/auth/register/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div class="card p-4 shadow-sm w-100" style="max-width: 500px;">
        <h2 class="text-center mb-4">Join GlobalConnect</h2>
        
        <form #regForm="ngForm" (ngSubmit)="onRegister()">
          <div class="btn-group w-100 mb-4" role="group">
            <input type="radio" class="btn-check" name="role" id="seeker" [value]="false" [(ngModel)]="user.isProvider">
            <label class="btn btn-outline-primary" for="seeker">I'm a Seeker</label>

            <input type="radio" class="btn-check" name="role" id="provider" [value]="true" [(ngModel)]="user.isProvider">
            <label class="btn btn-outline-primary" for="provider">I'm a Provider</label>
          </div>

          <div class="mb-3">
            <label class="form-label">Email address</label>
            <input type="email" class="form-control" [(ngModel)]="user.email" name="email" required placeholder="name@example.com">
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="user.password" name="password" required placeholder="Min. 8 characters">
          </div>

          <div class="row">
            <div class="col-6 mb-3">
              <label class="form-label">Language</label>
              <select class="form-select" [(ngModel)]="user.preferredLanguage" name="lang">
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label">Timezone</label>
              <select class="form-select" [(ngModel)]="user.timezoneId" name="tz">
                <option value="Europe/Berlin">Berlin (CET)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">New York (EST)</option>
              </select>
            </div>
          </div>

          <div class="form-check mb-4">
            <input class="form-check-input" type="checkbox" id="terms" required name="terms" ngModel>
            <label class="form-check-label" for="terms">
              I agree to the terms and conditions
            </label>
          </div>

          <button type="submit" [disabled]="!regForm.form.valid" class="btn btn-primary w-100 py-2">
            Create Account
          </button>
        </form>

        <p class="mt-4 text-center">Already have an account? <a routerLink="/login">Login here</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  // Default values matching your API requirement
  user = {
    email: '',
    password: '',
    isProvider: false,
    preferredLanguage: 'en',
    timezoneId: 'Europe/Berlin'
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: (res: any) => {
        // Log the user in immediately or redirect to login
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Error: ' + (err.error?.message || 'Registration failed'));
      }
    });
  }
}