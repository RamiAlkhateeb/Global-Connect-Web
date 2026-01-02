import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">RemoteCare</a>
        
        <div class="nav-links">
          <a routerLink="/home" routerLinkActive="active">Home</a>
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          
          <div class="settings-group">
            <select (change)="changeLang($any($event.target).value)">
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="de">DE</option>
            </select>
            <button (click)="toggleTheme()" class="theme-btn">🌓</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--nav-bg);
      border-bottom: 1px solid #eee;
      padding: 0.5rem 1rem;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .logo { font-weight: bold; font-size: 1.2rem; text-decoration: none; color: var(--primary-color); }
    .nav-links { display: flex; gap: 1.5rem; align-items: center; }
    .nav-links a { text-decoration: none; color: var(--text-color); font-size: 0.9rem; }
    .active { color: var(--primary-color); font-weight: 600; }
    .settings-group { display: flex; gap: 10px; }
  `]
})
export class NavbarComponent {
  toggleTheme() {
    document.body.classList.toggle('dark');
  }

  changeLang(lang: string) {
    // We'll connect this to your TranslateService
    console.log("Language changed to:", lang);
  }
}