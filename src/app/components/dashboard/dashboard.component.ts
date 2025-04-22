import { Component, OnInit } from '@angular/core';
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
    MatTabsModule,
    HeaderComponent,
    ControllerRequestsComponent,
    NotificationComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  showNotification: boolean = false;
  notificationMessage: string = 'Your request has been submitted and is being processed.';
  selectedTabIndex: number = 2; // Default to Troubleshoot Controller Health

  constructor() {
    // Remove automatic notification display
  }

  ngOnInit() {
    // Check if a selected tab is saved in localStorage
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab !== null) {
      this.selectedTabIndex = parseInt(savedTab, 10);
    } else {
      // Default to Troubleshoot Controller Health tab
      this.selectedTabIndex = 2;
    }
  }

  // Track tab changes and save the selection
  onTabChanged(index: number) {
    this.selectedTabIndex = index;
    localStorage.setItem('selectedTab', index.toString());
  }

  // Add a method to show notification that can be called after form submission
  showRequestNotification(message?: string) {
    if (message) {
      this.notificationMessage = message;
    }
    this.showNotification = true;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }
}
