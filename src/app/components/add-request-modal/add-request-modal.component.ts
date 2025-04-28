import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ControllerRequestService } from '../../services/controller-request.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ControllerService } from '../../services/controller.service';

interface Controller {
  name: string;
  id: string;
}

@Component({
  selector: 'app-add-request-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TranslateModule
  ],
  templateUrl: './add-request-modal.component.html',
  styleUrl: './add-request-modal.component.scss'
})
export class AddRequestModalComponent implements OnInit {
  requestForm: FormGroup;
  controllers: Controller[] = [];
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRequestModalComponent>,
    private controllerRequestService: ControllerRequestService,
    private translateService: TranslateService,
    private controllerService: ControllerService
  ) {
    this.requestForm = this.fb.group({
      controllerName: ['', Validators.required],
      emailNotification: ['', [Validators.required, Validators.email]]
    });
  }
  
  ngOnInit(): void {
    this.loadControllers();
  }

  loadControllers(): void {
    this.controllerService.getControllers().subscribe(
      (data: Controller[]) => {
        this.controllers = data;
      },
      (error: any) => {
        console.error('Error loading controllers:', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const formData = this.requestForm.value;
      this.dialogRef.close(formData);
    }
  }
}
