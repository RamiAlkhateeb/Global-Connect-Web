// booking.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [DatePipe], // Angular's DatePipe handles local conversion automatically
  template: `
    <div class="row">
      @for (slot of slots; track slot.slotId) {
        <div class="col-6 col-md-3 mb-2">
          <button 
            class="btn w-100" 
            [class.btn-success]="!slot.isBooked" 
            [class.btn-secondary]="slot.isBooked"
            [disabled]="slot.isBooked"
            (click)="bookSlot(slot.slotId)">
            
            {{ slot.startUTC | date:'shortTime' }}
          </button>
        </div>
      }
    </div>
  `
})
export class BookingComponent {
  slots: any[] = []; // Populated from API
  
  bookSlot(id: number) {
    // Call Booking Service POST /api/bookings
  }
}