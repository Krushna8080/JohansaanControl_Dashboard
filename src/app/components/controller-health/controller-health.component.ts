import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ControllerService } from '../../services/controller.service';
import { ControllerHealth } from '../../models/controller.model';

@Component({
  selector: 'app-controller-health',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './controller-health.component.html',
  styleUrl: './controller-health.component.scss'
})
export class ControllerHealthComponent implements OnInit {
  controllerId: string = '';
  controllerHealth?: ControllerHealth;

  constructor(
    private route: ActivatedRoute,
    private controllerService: ControllerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.controllerId = id;
        this.loadControllerHealth();
      }
    });
  }

  loadControllerHealth(): void {
    this.controllerService.getControllerHealth(this.controllerId).subscribe(health => {
      this.controllerHealth = health;
    });
  }

  downloadData(): void {
    if (!this.controllerHealth) return;
    
    // Create CSV content
    const headers = ['Point Name', 'Last Sample'];
    const csvRows = [headers];
    
    this.controllerHealth.points.forEach(point => {
      csvRows.push([point.pointName, point.lastSample]);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `controller-health-${this.controllerHealth.controllerName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  closeDialog(): void {
    window.history.back();
  }
}
