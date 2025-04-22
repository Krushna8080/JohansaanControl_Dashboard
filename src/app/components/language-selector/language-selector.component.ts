import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { LanguageService, SupportedLanguage } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective
  ],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  languages: SupportedLanguage[] = [];
  selectedLanguage: SupportedLanguage;
  isDropdownOpen = false;
  
  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    // Initialize with a default, will be updated in ngOnInit
    this.selectedLanguage = { code: 'en', name: 'English', flag: '🇺🇸' };
  }
  
  ngOnInit(): void {
    // Get languages from the service
    this.languages = this.languageService.getLanguages();
    
    // Get stored language preference or browser language
    const storedLang = localStorage.getItem('preferredLanguage');
    
    if (storedLang) {
      // Use the stored language preference
      this.setLanguage(storedLang);
    } else if (!this.translate.currentLang) {
      const browserLang = this.translate.getBrowserLang();
      const defaultLang = browserLang && this.languages.some(lang => lang.code === browserLang)
        ? browserLang
        : 'en';
      
      this.setLanguage(defaultLang);
    } else {
      // Use the current language from the translate service
      this.setLanguage(this.translate.currentLang);
    }
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  selectLanguage(language: SupportedLanguage): void {
    this.setLanguage(language.code);
    this.isDropdownOpen = false;
  }
  
  // Close dropdown when clicking outside
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
  
  private setLanguage(langCode: string): void {
    // Use the language service to set the language
    this.languageService.setLanguage(langCode);
    
    // Find and set the selected language object
    const lang = this.languages.find(l => l.code === langCode);
    if (lang) {
      this.selectedLanguage = lang;
    }
  }
}