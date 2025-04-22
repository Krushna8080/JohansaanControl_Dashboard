import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = {
  code: string;
  name: string;
  flag: string;
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private supportedLanguages: SupportedLanguage[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
  ];

  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>(this.supportedLanguages[0]);
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    private http: HttpClient,
    private translateService: TranslateService
  ) {
    // Set available languages for the translate service
    this.translateService.addLangs(this.supportedLanguages.map(lang => lang.code));
    this.translateService.setDefaultLang('en');
    
    this.initLanguage();
  }

  private initLanguage(): void {
    // First check for stored preference
    const storedLangCode = localStorage.getItem('preferredLanguage');
    
    if (storedLangCode) {
      // Use stored preference
      this.setLanguage(storedLangCode);
    } else {
      // Otherwise try browser language
      const browserLang = navigator.language.split('-')[0];
      
      // Check if browser language is supported
      const matchedLang = this.supportedLanguages.find(lang => lang.code === browserLang);
      
      if (matchedLang) {
        this.setLanguage(matchedLang.code);
      } else {
        // Default to English
        this.setLanguage('en');
      }
    }
  }

  public getLanguages(): SupportedLanguage[] {
    return this.supportedLanguages;
  }

  public getCurrentLanguage(): Observable<SupportedLanguage> {
    return this.currentLanguage$;
  }

  public setLanguage(langCode: string): void {
    const language = this.supportedLanguages.find(lang => lang.code === langCode);
    
    if (language) {
      try {
        // Update the translate service
        this.translateService.use(langCode);
        
        // Update current language
        this.currentLanguageSubject.next(language);
        
        // Save to localStorage for persistence
        localStorage.setItem('preferredLanguage', langCode);
        
        // Update document lang attribute for accessibility
        document.documentElement.lang = langCode;

        console.log(`Language changed to: ${language.name} (${langCode})`);
      } catch (error) {
        console.error(`Error setting language to ${langCode}:`, error);
      }
    } else {
      console.warn(`Language code not supported: ${langCode}`);
    }
  }

  public translate(key: string, params?: any): Observable<string> {
    return this.translateService.get(key, params);
  }

  public instant(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  // Use browser language detection instead of external API
  public detectUserLocation(): Observable<any> {
    // Create a simple result based on browser language
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    const countryCode = navigator.language.split('-')[1] || browserLang;
    
    // Create a synthetic response that mimics the ipapi.co response structure
    // but doesn't require an external API call
    const mockResponse = {
      ip: '127.0.0.1',
      country_code: countryCode || 'US',
      country_name: 'Local Browser',
      languages: navigator.language
    };
    
    console.log('Using browser language for location detection:', mockResponse);
    return of(mockResponse);
  }
  
  // Helper function for Observable creation
  private of<T>(value: T): Observable<T> {
    return new Observable(subscriber => {
      subscriber.next(value);
      subscriber.complete();
    });
  }

  // Based on country code, suggest an appropriate language
  public suggestLanguageByCountry(countryCode: string): string {
    const languageMap: {[key: string]: string} = {
      'US': 'en',
      'GB': 'en',
      'CA': 'en',
      'ES': 'es',
      'MX': 'es',
      'AR': 'es',
      'FR': 'fr',
      'DE': 'de',
      'AT': 'de',
      'CH': 'de',
      'PT': 'pt',
      'BR': 'pt',
      'JP': 'ja',
      'CN': 'zh',
      'TW': 'zh',
      'HK': 'zh',
      'IN': 'en',
      'AE': 'ar',
      'SA': 'ar',
      'EG': 'ar',
      'IT': 'it',
      'SM': 'it',
      'VA': 'it',
      'NL': 'nl',
      'BE': 'nl'
    };
    
    return languageMap[countryCode] || 'en';
  }
} 