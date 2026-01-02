import { Injectable, inject, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private renderer: Renderer2;
  private rendererFactory = inject(RendererFactory2);
  private translate = inject(TranslateService);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.init();
  }

  init() {
    // 1. Default Language
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    // 2. Check System Dark Mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.toggleDarkTheme(prefersDark.matches);
  }

  setLanguage(lang: 'en' | 'ar' | 'de') {
    this.translate.use(lang);
    
    // Handle RTL for Arabic
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }

  toggleDarkTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}