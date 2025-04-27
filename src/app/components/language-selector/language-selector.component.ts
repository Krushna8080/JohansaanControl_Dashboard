import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { LanguageService, SupportedLanguage } from '../../services/language.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    MatIconModule
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
    try {
      // Get languages from the service
      this.languages = this.languageService.getLanguages();
      console.log('Available languages:', this.languages);
      
      // Get stored language preference
      const storedLang = localStorage.getItem('preferredLanguage');
      console.log('Stored language:', storedLang);
      console.log('Current translate service language:', this.translate.currentLang);
      
      // Initial setup of selected language
      this.updateSelectedLanguage();
      
      // Subscribe to language changes from the service
      this.languageService.currentLanguage$.subscribe(lang => {
        console.log('Language changed in selector to:', lang);
        this.selectedLanguage = lang;
      });
      
      // Also monitor the translate service directly as a backup
      this.translate.onLangChange.subscribe(event => {
        console.log('TranslateService language changed to:', event.lang);
        this.updateSelectedLanguage(event.lang);
      });
    } catch (error) {
      console.error('Error in language selector initialization:', error);
    }
  }
  
  // Helper method to update the selected language based on current state
  private updateSelectedLanguage(langCode?: string): void {
    // Priority: 1. Passed langCode, 2. localStorage, 3. translate service, 4. Default 'en'
    const currentCode = langCode || 
                        localStorage.getItem('preferredLanguage') || 
                        this.translate.currentLang || 
                        'en';
    
    console.log('Updating selected language to code:', currentCode);
    
    const language = this.languages.find(l => l.code === currentCode);
    
    if (language) {
      this.selectedLanguage = language;
      
      // Also ensure localStorage is updated
      if (!localStorage.getItem('preferredLanguage') || 
          localStorage.getItem('preferredLanguage') !== currentCode) {
        localStorage.setItem('preferredLanguage', currentCode);
        console.log('Updated localStorage with language:', currentCode);
      }
      
      console.log('Selected language updated to:', language);
    } else {
      console.warn('Could not find language matching code:', currentCode);
      // Fall back to English
      this.selectedLanguage = this.languages.find(l => l.code === 'en') || this.selectedLanguage;
    }
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  selectLanguage(language: SupportedLanguage): void {
    try {
      console.log('User selected language:', language);
      
      // Ensure localStorage is updated
      localStorage.setItem('preferredLanguage', language.code);
      
      // Update the language service
      this.languageService.setLanguage(language.code);
      
      // Update the local state
      this.selectedLanguage = language;
      
      // Close the dropdown
      this.isDropdownOpen = false;
    } catch (error) {
      console.error('Error selecting language:', error);
    }
  }
  
  // Close dropdown when clicking outside
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}