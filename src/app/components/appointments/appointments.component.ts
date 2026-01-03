import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../core/services/appointment.service';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login'; // <--- Import GoogleLoginProvider  
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  private apptService = inject(AppointmentService);
  // Inject the Library Service to talk to Google
  private socialAuthService = inject(SocialAuthService);

  appointments: any[] = [];
  isLoading = false;
  isSyncing = false;

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.apptService.getHistory().subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  // The Workaround Action
  syncNow() {
    this.isSyncing = true;
    
    // 1. Get a fresh Access Token from Google
    this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => {
      console.log("Got Google Token for Calendar:", accessToken);
      // 2. Send it to Backend
      this.apptService.syncGoogleCalendar(accessToken).subscribe({
        next: (res) => {
          alert(res.message); // "Synced 2 new appointments"
          this.loadHistory(); // Refresh list
          this.isSyncing = false;
        },
        error: (err) => {
          console.error(err);
          alert('Sync failed. Please ensure you granted Calendar permissions.');
          this.isSyncing = false;
        }
      });
    }).catch(err => {
        console.error("Google Auth Failed", err);
        this.isSyncing = false;
    });
  }
}