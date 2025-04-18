import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ControllerService } from '../../services/controller.service';
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
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  location: string = 'Sun Valley Mall';
  weatherData: WeatherData[] = [];

  constructor(private controllerService: ControllerService) {
    this.loadWeatherData();
  }

  loadWeatherData(): void {
    this.controllerService.getWeatherData().subscribe(data => {
      this.weatherData = data;
    });
  }
}
