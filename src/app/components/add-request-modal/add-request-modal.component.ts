import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ControllerRequestService } from '../../services/controller-request.service';
import { TimezoneService } from '../../services/timezone.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule
  ],
  templateUrl: './add-request-modal.component.html',
  styleUrl: './add-request-modal.component.scss'
})
export class AddRequestModalComponent implements OnInit {
  requestForm: FormGroup;
  controllers: {name: string, location: string}[] = [];
  requestors: string[] = [];
  currentTimezone: string = '';
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRequestModalComponent>,
    private controllerRequestService: ControllerRequestService,
    private timezoneService: TimezoneService,
    private translateService: TranslateService
  ) {
    this.requestForm = this.fb.group({
      controllerName: ['', Validators.required],
      installLocation: [{value: '', disabled: true}],
      requestor: ['', Validators.required],
      emailNotification: ['', [Validators.email]]
    });
  }
  
  ngOnInit(): void {
    // Get available controllers
    this.controllerRequestService.getControllers().subscribe(controllers => {
      this.controllers = controllers;
    });
    
    // Get requestor options
    this.controllerRequestService.getRequestors().subscribe(requestors => {
      this.requestors = requestors;
    });
    
    // Get current timezone
    this.currentTimezone = this.timezoneService.getUserTimezone();
    
    // Listen for controller selection changes to update location
    this.requestForm.get('controllerName')?.valueChanges.subscribe(controllerName => {
      const controller = this.controllers.find(c => c.name === controllerName);
      if (controller) {
        this.requestForm.get('installLocation')?.setValue(controller.location);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const result = {
        controllerName: this.requestForm.value.controllerName,
        installLocation: this.requestForm.get('installLocation')?.value,
        requestor: this.requestForm.value.requestor,
        requestDate: new Date().toISOString() // This will be converted to UTC in the parent component
      };
      
      this.dialogRef.close(result);
    }
  }
}
