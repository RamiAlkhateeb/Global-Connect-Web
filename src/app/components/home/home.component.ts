import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService, ProviderSummary } from '../../core/services/provider.service';
import { FormsModule } from '@angular/forms'; // For the search bar

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private providerService = inject(ProviderService);

  providers: ProviderSummary[] = [];
  filteredProviders: ProviderSummary[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  private cdr = inject(ChangeDetectorRef); // <--- Inject the tool

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    this.isLoading = true;
    console.log('1. Starting Request...'); // <--- Debug Log
    this.providerService.searchProviders().subscribe({
      next: (data) => {
        console.log('2. Data Received:', data); // <--- See what arrived
        // Ensure data is actually an array before assigning
        if (Array.isArray(data)) {
          this.providers = data;
          this.filteredProviders = data;
        } else {
          console.error('Data is NOT an array. It is:', typeof data);
          // Handle if it's wrapped (e.g. data.result)
          // this.providers = (data as any).result; 
        }
        this.isLoading = false; // <--- MUST BE CALLED
        console.log('3. Loading set to false');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = 'Failed to load data.';
        this.isLoading = false; // <--- Ensure this runs on error too
        // Force update on error too
        this.cdr.detectChanges();
      }
    });
  }

  // Instant filtering as user types
  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProviders = this.providers.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.specialty.toLowerCase().includes(term) ||
      p.nationality.toLowerCase().includes(term)
    );
  }

  bookAppointment(url: string) {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('This provider has not set up a booking link yet.');
    }
  }

  // Fallback if image fails to load
  handleImageError(event: any) {
    event.target.src = 'assets/default-avatar.png'; // Ensure you have this image in assets
  }

  // Inside HomeComponent class
  trackById(index: number, item: ProviderSummary) {
    return item.providerId;
  }
}