import { ApplicationConfig, importProvidersFrom } from '@angular/core';
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
      provide: 'APP_INITIALIZER',
      useFactory: (translateService: TranslateService) => {
        return () => {
          // Make sure all languages are added and available
          translateService.addLangs(SUPPORTED_LANGUAGES);
          translateService.setDefaultLang('en');
          
          // Get stored language or browser language or default to English
          const storedLang = localStorage.getItem('preferredLanguage');
          const browserLang = translateService.getBrowserLang();
          const initialLang = storedLang || 
            (browserLang && SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en');
          
          // Set initial language
          return translateService.use(initialLang).toPromise();
        };
      },
      deps: [TranslateService],
      multi: true
    }
  ]
};
