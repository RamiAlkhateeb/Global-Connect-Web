import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Auth Imports
import { SocialAuthService, GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GoogleSigninButtonModule
  ]
})
export class LoginComponent implements OnInit {
  private socialAuthService = inject(SocialAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.socialAuthService.authState.subscribe({
      next: (user: SocialUser) => {
        if (user && user.idToken) {
          this.loginWithBackend(user.idToken);
        }
      },
      error: (err) => {
        this.errorMessage = "Google login failed. Please try again.";
        console.error(err);
      }
    });
  }

  private loginWithBackend(token: string) {
    this.isLoading = true;
    this.authService.loginWithGoogle(token).subscribe({
      next: (res) => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Backend authentication failed.";
        console.error(err);
      }
    });
  }
}