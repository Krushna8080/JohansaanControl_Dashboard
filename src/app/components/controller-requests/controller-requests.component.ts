import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ControllerRequestService } from '../../services/controller-request.service';
import { ControllerRequest } from '../../models/controller.model';
import { AddRequestModalComponent } from '../add-request-modal/add-request-modal.component';
import { TimezoneService } from '../../services/timezone.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuHoverDirective } from '../../directives/menu-hover.directive';

@Component({
  selector: 'app-controller-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatPaginatorModule,
    TranslateModule,
    MenuHoverDirective
  ],
  templateUrl: './controller-requests.component.html',
  styleUrl: './controller-requests.component.scss'
})
export class ControllerRequestsComponent implements OnInit, OnDestroy {
  controllerRequests: ControllerRequest[] = [];
  totalRequests: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loading: boolean = false;
  
  // Sorting
  currentSortField: keyof ControllerRequest = 'requestDate';
  currentSortDirection: 'asc' | 'desc' = 'desc';

  // Filtering
  statusOptions: string[] = ['Processing', 'Completed', 'Cancelled'];
  requestorOptions: string[] = [];
  filterForm: FormGroup;
  
  // Timezone
  userTimezone: string = '';

  @Output() requestSubmitted = new EventEmitter<string>();

  // Reference to menu triggers for closing menus programmatically
  @ViewChild('statusMenuTrigger') statusMenuTrigger!: MatMenuTrigger;
  @ViewChild('requestDateMenuTrigger') requestDateMenuTrigger!: MatMenuTrigger;
  @ViewChild('requestorMenuTrigger') requestorMenuTrigger!: MatMenuTrigger;
  @ViewChild('completedDateMenuTrigger') completedDateMenuTrigger!: MatMenuTrigger;

  private destroy$ = new Subject<void>();

  constructor(
    private controllerRequestService: ControllerRequestService,
    private timezoneService: TimezoneService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private el: ElementRef,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      requestDateStart: [null],
      requestDateEnd: [null],
      requestor: [''],
      completedDateStart: [null],
      completedDateEnd: [null]
    });
  }

  ngOnInit(): void {
    // Get user's timezone
    this.userTimezone = this.timezoneService.getUserTimezone();
    console.log('User timezone:', this.userTimezone);
    
    // Get requestor options for filter
    this.controllerRequestService.getRequestors().subscribe(requestors => {
      this.requestorOptions = requestors;
    });
    
    // Get total request count
    this.controllerRequestService.getTotalRequests().subscribe(total => {
      this.totalRequests = total;
    });
    
    // Initial load
    this.loadControllerRequests();
    
    // Listen to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadControllerRequests(true);
    });
  }

  // Handle page change
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadControllerRequests();
  }

  loadControllerRequests(isFiltering: boolean = false): void {
    this.loading = true;
    
    if (isFiltering) {
      // Apply filters
      this.controllerRequestService.filterRequests(this.filterForm.value).subscribe(requests => {
        this.controllerRequests = requests.slice(this.currentPage * this.pageSize, 
                                                (this.currentPage + 1) * this.pageSize);
        this.totalRequests = requests.length;
        this.loading = false;
      });
    } else {
      // Regular pagination
      this.controllerRequestService.getRequests(this.currentPage, this.pageSize).subscribe(requests => {
        this.controllerRequests = requests;
        this.loading = false;
      });
    }
  }

  // Reload controller requests data
  reloadData(): void {
    // Reset to first page
    this.currentPage = 0;
    
    // Clear any active filters
    if (this.filterForm.dirty) {
      this.clearFilters();
    }
    
    // Reload total count
    this.controllerRequestService.getTotalRequests().subscribe(total => {
      this.totalRequests = total;
    });
    
    // Reload data with loading indicator
    this.loading = true;
    this.controllerRequestService.getRequests(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests) => {
          console.log('Reloaded requests:', requests);
          
          // Do a quick validation of date fields
          for (const request of requests) {
            console.log(`Request ${request.id} date:`, request.requestDate);
            const formattedRequestDate = this.formatDateTime(request.requestDate);
            console.log(`Request ${request.id} formatted date:`, formattedRequestDate);
            
            if (request.completedDate) {
              console.log(`Request ${request.id} completed date:`, request.completedDate);
              const formattedCompletedDate = this.formatDateTime(request.completedDate);
              console.log(`Request ${request.id} formatted completed date:`, formattedCompletedDate);
            }
          }
          
          this.controllerRequests = requests;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading requests:', error);
          this.loading = false;
        }
      });
  }

  // Open the modal to add a new request
  openAddRequestModal(): void {
    const dialogRef = this.dialog.open(AddRequestModalComponent, {
      width: '350px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'compact-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add the user's timezone to the request with the current time
        const currentTime = new Date();
        console.log('Current time before conversion:', currentTime);
        console.log('Current time as ISO string:', currentTime.toISOString());
        
        // Ensure we're using proper ISO format for the requestDate
        const utcDateString = this.timezoneService.localToUtc(currentTime);
        console.log('UTC date string for request:', utcDateString);
        
        const requestWithTimezone = {
          ...result,
          requestDate: utcDateString
        };
        
        // Verify the request date can be formatted correctly
        console.log('Preview of formatted date:', 
                   this.timezoneService.formatDateTime(requestWithTimezone.requestDate, this.translateService.currentLang));
        
        this.controllerRequestService.addRequest(requestWithTimezone)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (addedRequest) => {
              console.log('Added request with date:', addedRequest.requestDate);
              
              // Immediately check if we can format this date correctly
              const formattedDate = this.formatDateTime(addedRequest.requestDate);
              console.log('Formatted date of new request:', formattedDate);
              
              // Use the new reload method to refresh data
              this.reloadData();
              
              // Show notification with the new style
              this.snackBar.open(
                '✓ Your request has been submitted and is being processed.',
                'DISMISS',
                { 
                  duration: 5000,
                  panelClass: ['notification-bar'],
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                }
              );
            },
            error: (error) => {
              console.error('Error adding request:', error);
              this.snackBar.open(
                this.translateService.instant('CONTROLLER_REQUESTS.ERROR_ADDING_REQUEST'),
                this.translateService.instant('COMMON.CLOSE'),
                { 
                  duration: 3000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'center'
                }
              );
            }
          });
      }
    });
  }

  sortBy(field: keyof ControllerRequest): void {
    // Allow sorting by all columns except the Results column (which isn't a field)
    
    if (this.currentSortField === field) {
      // Toggle direction
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = field;
      this.currentSortDirection = 'asc';
    }
    
    this.controllerRequestService.sortRequests(field, this.currentSortDirection);
    this.currentPage = 0;
    this.loadControllerRequests();
    this.closeFilterMenus();
  }

  getSortIconClass(field: keyof ControllerRequest): string {
    if (this.currentSortField !== field) {
      return 'sort-icon-inactive';
    }
    return this.currentSortDirection === 'asc' ? 'sort-icon-asc' : 'sort-icon-desc';
  }

  openStatusFilter(): void {
    // Handle in template
  }

  openRequestDateFilter(): void {
    // Handle in template
  }

  openRequestorFilter(): void {
    // Handle in template
  }

  openCompletedDateFilter(): void {
    // Handle in template
  }

  clearFilters(): void {
    this.filterForm.reset({
      status: '',
      requestDateStart: null,
      requestDateEnd: null,
      requestor: '',
      completedDateStart: null,
      completedDateEnd: null
    });
  }

  // Format dates for display (date only)
  formatDate(date: string | undefined): string {
    if (!date) return '-';
    const languageCode = this.translateService.currentLang;
    return this.timezoneService.formatDate(date, languageCode);
  }
  
  // Format time for display
  formatTime(date: string | undefined): string {
    if (!date) return '-';
    const languageCode = this.translateService.currentLang;
    return this.timezoneService.formatTime(date, languageCode);
  }
  
  // Format date and time together
  formatDateTime(date: string | undefined): string {
    if (!date) return '-';
    const languageCode = this.translateService.currentLang;
    return this.timezoneService.formatDateTime(date, languageCode);
  }

  // Add getter methods for form controls
  getStatusControl(): FormControl {
    return this.filterForm.get('status') as FormControl;
  }
  
  getRequestorControl(): FormControl {
    return this.filterForm.get('requestor') as FormControl;
  }
  
  getRequestDateStartControl(): FormControl {
    return this.filterForm.get('requestDateStart') as FormControl;
  }
  
  getRequestDateEndControl(): FormControl {
    return this.filterForm.get('requestDateEnd') as FormControl;
  }
  
  getCompletedDateStartControl(): FormControl {
    return this.filterForm.get('completedDateStart') as FormControl;
  }
  
  getCompletedDateEndControl(): FormControl {
    return this.filterForm.get('completedDateEnd') as FormControl;
  }

  // Close any open filter menus
  closeFilterMenus(): void {
    // Close all menus programmatically
    if (this.statusMenuTrigger?.menuOpen) {
      this.statusMenuTrigger.closeMenu();
    }
    if (this.requestDateMenuTrigger?.menuOpen) {
      this.requestDateMenuTrigger.closeMenu();
    }
    if (this.requestorMenuTrigger?.menuOpen) {
      this.requestorMenuTrigger.closeMenu();
    }
    if (this.completedDateMenuTrigger?.menuOpen) {
      this.completedDateMenuTrigger.closeMenu();
    }
  }

  // Apply filters and close menu
  applyFilters(): void {
    this.currentPage = 0;
    this.loadControllerRequests(true);
    // Don't close the menu - this allows users to make multiple selections
  }
  
  // Check if any filters are active
  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return !!(
      formValue.status || 
      formValue.requestDateStart || 
      formValue.requestDateEnd || 
      formValue.requestor || 
      formValue.completedDateStart || 
      formValue.completedDateEnd
    );
  }
  
  ngOnDestroy(): void {
    // Complete the subject to avoid memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
