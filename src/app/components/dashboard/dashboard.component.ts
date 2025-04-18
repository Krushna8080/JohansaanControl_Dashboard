import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { ControllerRequestsComponent } from '../controller-requests/controller-requests.component';
import { NotificationComponent } from '../notification/notification.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ControllerRequestsComponent,
    NotificationComponent,
    MatTabsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  showNotification: boolean = false;
  notificationMessage: string = 'Your request has been submitted and is being processed.';

  constructor() {
    // Simulate a notification appearing after 2 seconds
    setTimeout(() => {
      this.showNotification = true;
    }, 2000);
  }
}
