import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ControllerService } from '../../services/controller.service';
import { LanguageService, SupportedLanguage } from '../../services/language.service';
import { WeatherData } from '../../models/controller.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  location: string = 'Sun Valley Mall';
  currentLanguage: SupportedLanguage | string = 'en';
  availableLanguages: { code: string, name: string, flag?: string }[] = [];
  weatherData: WeatherData[] = [];

  constructor(
    private controllerService: ControllerService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {
    this.loadWeatherData();
  }

  ngOnInit(): void {
    // Get the current language
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    
    // Get available languages
    this.availableLanguages = this.languageService.getLanguages();
  }

  loadWeatherData(): void {
    this.controllerService.getWeatherData().subscribe(data => {
      this.weatherData = data;
    });
  }

  changeLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
  }

  getCurrentLanguageName(): string {
    if (typeof this.currentLanguage === 'string') {
      const lang = this.availableLanguages.find(l => l.code === this.currentLanguage);
      return lang ? lang.name : 'English';
    }
    return this.currentLanguage.name || 'English';
  }
}
