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
      <div class="container">
        <a routerLink="/home" class="logo">RemoteCare</a>
        
        <div class="links">
          <a routerLink="/home" routerLinkActive="active">
            <span class="icon">🏠</span> Home
          </a>

          <a routerLink="/appointments" routerLinkActive="active">
            <span class="icon">📅</span> My Bookings
          </a>

          <a routerLink="/profile" routerLinkActive="active">
            <span class="icon">👤</span> Profile
          </a>

          <button (click)="toggleTheme()" class="theme-btn">🌓</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { 
      background: var(--nav-bg); 
      border-bottom: 1px solid #eee; 
      padding: 0.8rem 1rem; 
      position: sticky; top: 0; z-index: 100; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .container { 
      display: flex; justify-content: space-between; align-items: center; 
      max-width: 1000px; margin: 0 auto; 
    }
    .logo { 
      font-weight: 800; font-size: 1.3rem; 
      color: var(--primary-color); text-decoration: none; 
      letter-spacing: -0.5px;
    }
    .links { display: flex; gap: 25px; align-items: center; }
    
    .links a { 
      text-decoration: none; color: var(--text-color); font-size: 0.95rem; font-weight: 500;
      display: flex; align-items: center; gap: 6px; transition: color 0.2s;
    }
    .links a:hover { color: var(--primary-color); }
    
    /* Active State (Blue text) */
    .active { color: var(--primary-color) !important; }
    
    .theme-btn { 
      background: none; border: none; font-size: 1.2rem; cursor: pointer; 
      padding: 5px; border-radius: 50%; transition: background 0.2s;
    }
    .theme-btn:hover { background: rgba(0,0,0,0.05); }

    /* Mobile Responsive tweaks */
    @media (max-width: 600px) {
      .links a span.icon { display: inline; } /* Show icon */
      .links a { font-size: 0; } /* Hide text on small screens */
      .links a span.icon { font-size: 1.4rem; } /* Make icons bigger */
    }
  `]
})
export class NavbarComponent {
  toggleTheme() {
    document.body.classList.toggle('dark');
  }


}