import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);

  constructor() {
    // 1. Set Default
    this.translate.setDefaultLang('en');
    
    // 2. Check saved preference or use default
    const savedLang = localStorage.getItem('lang') || 'en';
    this.switchLanguage(savedLang);
  }

  switchLanguage(lang: string) {
    // A. Change the language
    this.translate.use(lang);
    localStorage.setItem('lang', lang);

    // B. Flip the Layout (RTL / LTR)
    const htmlTag = this.document.getElementsByTagName('html')[0];
    
    if (lang === 'ar') {
      htmlTag.setAttribute('dir', 'rtl');
      htmlTag.setAttribute('lang', 'ar');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
      htmlTag.setAttribute('lang', 'en');
    }
  }

  getCurrentLang() {
    return this.translate.currentLang;
  }
}