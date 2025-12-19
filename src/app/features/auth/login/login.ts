// src/app/features/auth/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container d-flex align-items-center justify-content-center vh-100">
      <div class="card p-4 shadow-sm" style="max-width: 400px; width: 100%;">
        <h2 class="text-center mb-4">GlobalConnect Login</h2>
        <form (ngSubmit)="onLogin()">
          <div class="mb-3">
            <label class="form-label">Email address</label>
            <input type="email" class="form-control" [(ngModel)]="credentials.email" name="email" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="credentials.password" name="password" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <p class="mt-3 text-center">Don't have an account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/search']),
      error: (err) => {
      console.error('Full HTTP Error:', err); // <--- Add this to see the real status code
      alert('Login failed: ' + (err.error?.message || err.statusText || 'Server unreachable'));
    }
    });
  }
}