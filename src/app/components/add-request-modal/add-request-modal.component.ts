import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-request-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-request-modal.component.html',
  styleUrl: './add-request-modal.component.scss'
})
export class AddRequestModalComponent {
  controllerOptions: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
  selectedController: string = '';
  emailNotification: string = '';

  constructor(public dialogRef: MatDialogRef<AddRequestModalComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.selectedController) {
      this.dialogRef.close({
        controllerName: this.selectedController,
        notification: this.emailNotification
      });
    }
  }
}
