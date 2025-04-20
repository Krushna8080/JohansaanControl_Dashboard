import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ControllerService } from '../../services/controller.service';
import { ControllerRequest } from '../../models/controller.model';
import { AddRequestModalComponent } from '../add-request-modal/add-request-modal.component';

@Component({
  selector: 'app-controller-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './controller-requests.component.html',
  styleUrl: './controller-requests.component.scss'
})
export class ControllerRequestsComponent implements OnInit {
  controllerRequests: ControllerRequest[] = [];
  @Output() requestSubmitted = new EventEmitter<string>();

  constructor(
    private controllerService: ControllerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadControllerRequests();
  }

  loadControllerRequests(): void {
    this.controllerService.getControllerRequests().subscribe(requests => {
      this.controllerRequests = requests;
    });
  }

  openAddRequestModal(): void {
    const dialogRef = this.dialog.open(AddRequestModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.controllerService.addControllerRequest(result).subscribe(() => {
          this.loadControllerRequests();
          this.requestSubmitted.emit('Your request has been submitted and is being processed.');
        });
      }
    });
  }
}
