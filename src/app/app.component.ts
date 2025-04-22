import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './services/language.service';
import { TimezoneService } from './services/timezone.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private languageService: LanguageService,
    private timezoneService: TimezoneService
  ) {}

  ngOnInit(): void {
    this.detectUserLanguage();
  }

  private detectUserLanguage(): void {
    // Try to detect user's language using browser settings
    this.languageService.detectUserLocation().subscribe({
      next: (locationData) => {
        if (locationData && locationData.country_code) {
          const suggestedLanguage = this.languageService.suggestLanguageByCountry(locationData.country_code);
          console.log(`Detected country: ${locationData.country_code}, suggesting language: ${suggestedLanguage}`);
          this.languageService.setLanguage(suggestedLanguage);
        }
      },
      error: (error) => {
        console.warn('Unable to detect user language:', error);
        // Fallback to browser language
        const browserLang = navigator.language.split('-')[0];
        this.languageService.setLanguage(browserLang);
      }
    });

    // Get timezone from browser
    const userTimezone = this.timezoneService.getUserTimezone();
    console.log(`Browser timezone: ${userTimezone}`);
  }
}
