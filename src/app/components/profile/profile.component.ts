import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  FormArray, 
  FormControl 
} from '@angular/forms';
import { ProviderService } from '../../core/services/provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private providerService = inject(ProviderService);
  private router = inject(Router);

  profileForm: FormGroup;
  isLoading = false;
  isSaving = false;
  
  // Data sources
  allLanguages: any[] = [];
  
  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      specialty: ['', Validators.required],
      nationality: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(500)]],
      googleBookingUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      languageIds: [[], Validators.required] // Holds the array of IDs
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // 1. Get All Available Languages first
    this.providerService.getLanguages().subscribe({
      next: (langs) => {
        this.allLanguages = langs;
        
        // 2. Get My Profile
        this.providerService.getMyProfile().subscribe({
          next: (profile) => {
            if (profile) {
              this.profileForm.patchValue({
                displayName: profile.name,
                specialty: profile.specialty,
                nationality: profile.nationality,
                bio: profile.bio,
                googleBookingUrl: profile.googleBookingUrl,
                languageIds: profile.languageIds || []
              });
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Profile fetch error', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Language fetch error', err);
        this.isLoading = false;
      }
    });
  }

  // Helper to check if a language is selected
  isLanguageSelected(langId: number): boolean {
    const currentIds = this.profileForm.get('languageIds')?.value || [];
    return currentIds.includes(langId);
  }

  // Toggle selection for the custom chip UI
  toggleLanguage(langId: number) {
    const currentIds = this.profileForm.get('languageIds')?.value || [];
    let newIds = [];

    if (currentIds.includes(langId)) {
      newIds = currentIds.filter((id: number) => id !== langId); // Remove
    } else {
      newIds = [...currentIds, langId]; // Add
    }

    this.profileForm.patchValue({ languageIds: newIds });
    this.profileForm.markAsDirty();
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    this.providerService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Profile Updated Successfully!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        alert('Failed to save profile.');
      }
    });
  }
}