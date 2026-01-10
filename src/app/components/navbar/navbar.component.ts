import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public langService = inject(LanguageService);
  toggleTheme() {
    document.body.classList.toggle('dark');
  }

get currentLang() {
    return this.langService.getCurrentLang();
  }

  toggleLang() {
    const newLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.langService.switchLanguage(newLang);
  }
}