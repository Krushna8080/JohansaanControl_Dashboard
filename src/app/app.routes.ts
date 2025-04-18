import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ControllerHealthComponent } from './components/controller-health/controller-health.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'controller/:id', component: ControllerHealthComponent },
  { path: '**', redirectTo: 'dashboard' }
];
