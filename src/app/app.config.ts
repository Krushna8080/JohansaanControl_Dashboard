import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// List all supported languages
export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'pt', 'ja', 'zh', 'it', 'nl'
];

// Factory function to initialize translations
export function initializeLanguage(translateService: TranslateService) {
  return () => {
    // Set available languages
    translateService.addLangs(SUPPORTED_LANGUAGES);
    translateService.setDefaultLang('en');
    
    // Get stored language from localStorage
    const storedLang = localStorage.getItem('preferredLanguage');
    console.log('Initializing language, stored preference:', storedLang);
    
    // Use stored language if available, otherwise try browser language, then fallback to English
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      console.log('Using stored language preference:', storedLang);
      return translateService.use(storedLang).toPromise();
    } else {
      const browserLang = translateService.getBrowserLang();
      const useLang = browserLang && SUPPORTED_LANGUAGES.includes(browserLang) 
        ? browserLang 
        : 'en';
      console.log('Using detected or default language:', useLang);
      return translateService.use(useLang).toPromise();
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' }},
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'en',
        isolate: false,
        extend: true
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguage,
      deps: [TranslateService],
      multi: true
    }
  ]
};
