import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ControllerRequest } from '../models/controller.model';
import { TimezoneService } from './timezone.service';
import { ControllerService } from './controller.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerRequestService {
  private requests: ControllerRequest[] = [];
  private requestsSubject = new BehaviorSubject<ControllerRequest[]>([]);
  public requests$ = this.requestsSubject.asObservable();

  private static CONTROLLERS = [
    { name: 'NAE45-1', location: 'Intelligent Building Platform >> Building A' },
    { name: 'NAE45-2', location: 'Intelligent Building Platform >> Building B' },
    { name: 'NAE45-3', location: 'Intelligent Building Platform >> Building C' },
    { name: 'VAV-101', location: 'HVAC System >> Floor 1' },
    { name: 'VAV-202', location: 'HVAC System >> Floor 2' },
    { name: 'FCU-301', location: 'HVAC System >> Floor 3' },
    { name: 'FCU-401', location: 'HVAC System >> Floor 4' },
    { name: 'AHU-501', location: 'HVAC System >> Mechanical Room' },
  ];

  private static REQUESTORS = [
    'User Name 1',
    'User Name 2',
    'User Name 3',
    'User Name 4',
    'User Name 5'
  ];

  constructor(
    private timezoneService: TimezoneService,
    private controllerService: ControllerService
  ) {
    // First load any existing controller requests from the original service
    this.controllerService.getControllerRequests().subscribe(existingRequests => {
      // Store the existing requests
      const formattedExistingRequests = existingRequests.map(req => {
        // Format the dates to ISO strings if they aren't already
        return {
          ...req,
          requestDate: this.ensureISODate(req.requestDate),
          completedDate: req.completedDate ? this.ensureISODate(req.completedDate) : undefined
        };
      });
      
      // Then generate additional mock data
      this.generateMockRequests(formattedExistingRequests);
    });
  }

  // Convert date strings to ISO format if needed
  private ensureISODate(dateStr: string): string {
    try {
      // Try to parse the date string
      const date = new Date(dateStr);
      // Check if it's already an ISO string
      if (dateStr.includes('T') && dateStr.includes('Z')) {
        return dateStr;
      }
      // Convert to ISO string
      return date.toISOString();
    } catch (e) {
      // If parsing fails, return the current date as ISO
      return new Date().toISOString();
    }
  }

  private generateMockRequests(existingRequests: ControllerRequest[] = []): void {
    // Create additional random mock requests to reach 20 total
    const now = new Date();
    const statuses: ('Processing' | 'Completed' | 'Cancelled')[] = ['Processing', 'Completed', 'Cancelled'];
    
    const additionalRequests = Array.from({ length: Math.max(0, 20 - existingRequests.length) }, (_, index) => {
      const requestDate = new Date(now);
      requestDate.setDate(now.getDate() - Math.floor(Math.random() * 10));
      
      const controller = ControllerRequestService.CONTROLLERS[Math.floor(Math.random() * ControllerRequestService.CONTROLLERS.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const completedDate = status === 'Completed' ? 
        new Date(new Date(requestDate).setHours(requestDate.getHours() + Math.floor(Math.random() * 48))) : 
        undefined;
      
      return {
        id: `REQ-${2000 + existingRequests.length + index}`,
        controllerName: controller.name,
        installLocation: controller.location,
        requestDate: requestDate.toISOString(),
        requestor: ControllerRequestService.REQUESTORS[Math.floor(Math.random() * ControllerRequestService.REQUESTORS.length)],
        status: status,
        completedDate: completedDate?.toISOString()
      };
    });
    
    // Combine existing and new requests
    this.requests = [...existingRequests, ...additionalRequests];
    
    // Sort by request date descending (newest first)
    this.requests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    
    this.requestsSubject.next(this.requests);
  }

  // Get requests with pagination
  public getRequests(page: number = 0, pageSize: number = 10): Observable<ControllerRequest[]> {
    const start = page * pageSize;
    const end = start + pageSize;
    
    // Make sure we have at least 20 records for pagination demo
    if (this.requests.length < 20) {
      this.generateMoreMockData(20 - this.requests.length);
    }
    
    const paginatedResults = this.requests.slice(start, end);
    
    return of(paginatedResults).pipe(
      delay(300) // Simulate network delay
    );
  }

  // Generate additional mock data if needed
  private generateMoreMockData(count: number): void {
    const now = new Date();
    const statuses: ('Processing' | 'Completed' | 'Cancelled')[] = ['Processing', 'Completed', 'Cancelled'];
    
    const additionalRequests = Array.from({ length: count }, (_, index) => {
      const requestDate = new Date(now);
      requestDate.setDate(now.getDate() - Math.floor(Math.random() * 30)); // Spread over last 30 days
      
      const controller = ControllerRequestService.CONTROLLERS[Math.floor(Math.random() * ControllerRequestService.CONTROLLERS.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const completedDate = status === 'Completed' ? 
        new Date(new Date(requestDate).setHours(requestDate.getHours() + Math.floor(Math.random() * 48))) : 
        undefined;
      
      return {
        id: `REQ-${3000 + this.requests.length + index}`,
        controllerName: controller.name,
        installLocation: controller.location,
        requestDate: requestDate.toISOString(),
        requestor: ControllerRequestService.REQUESTORS[Math.floor(Math.random() * ControllerRequestService.REQUESTORS.length)],
        status: status,
        completedDate: completedDate?.toISOString()
      };
    });
    
    this.requests = [...this.requests, ...additionalRequests];
    
    // Sort by request date descending (newest first)
    this.requests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    
    this.requestsSubject.next(this.requests);
  }

  // Get the total number of requests
  public getTotalRequests(): Observable<number> {
    return of(this.requests.length);
  }

  // Add a new request
  public addRequest(request: Omit<ControllerRequest, 'id' | 'status'>): Observable<ControllerRequest> {
    console.log('Adding request with date:', request.requestDate);
    
    // Ensure date is in ISO format
    let requestDate: string;
    if (typeof request.requestDate === 'string') {
      requestDate = request.requestDate;
    } else {
      // Default to current time if no date is provided
      requestDate = new Date().toISOString();
    }
    
    console.log('Validated request date:', requestDate);
    
    const newRequest: ControllerRequest = {
      ...request,
      id: `REQ-${2000 + this.requests.length}`,
      status: 'Processing',
      requestDate: requestDate
    };
    
    // Verify date formatting
    console.log('New request created with date:', newRequest.requestDate);
    try {
      const testDate = new Date(newRequest.requestDate);
      console.log('Date parsed successfully:', testDate);
    } catch (error) {
      console.error('Error parsing date:', error);
    }
    
    this.requests.unshift(newRequest); // Add to the beginning (newest first)
    this.requestsSubject.next(this.requests);
    
    // Also add to the original controller service to maintain compatibility
    this.controllerService.addControllerRequest({
      controllerName: newRequest.controllerName,
      installLocation: newRequest.installLocation,
      requestor: newRequest.requestor
    }).subscribe();
    
    // Force immediate reload of data
    this.requestsSubject.next([...this.requests]);
    
    return of(newRequest).pipe(
      delay(300) // Simulate network delay
    );
  }

  // Sort requests by field and direction
  public sortRequests(field: keyof ControllerRequest, direction: 'asc' | 'desc'): void {
    this.requests.sort((a, b) => {
      // Define variables with appropriate types
      let valueA: any = a[field];
      let valueB: any = b[field];
      
      // Handle date comparison by converting dates to timestamps (numbers)
      if (field === 'requestDate' || field === 'completedDate') {
        const dateA = valueA ? new Date(valueA as string).getTime() : 0;
        const dateB = valueB ? new Date(valueB as string).getTime() : 0;
        valueA = dateA;
        valueB = dateB;
      }
      
      // Handle string comparisons (case-insensitive)
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      // Ensure values are comparable
      if (valueA === undefined || valueA === null) valueA = '';
      if (valueB === undefined || valueB === null) valueB = '';
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    this.requestsSubject.next(this.requests);
  }

  // Filter requests
  public filterRequests(filters: {
    status?: string;
    requestDateStart?: Date;
    requestDateEnd?: Date;
    requestor?: string;
    completedDateStart?: Date;
    completedDateEnd?: Date;
  }): Observable<ControllerRequest[]> {
    let filteredRequests = [...this.requests];
    
    if (filters.status) {
      filteredRequests = filteredRequests.filter(r => r.status === filters.status);
    }
    
    if (filters.requestor) {
      filteredRequests = filteredRequests.filter(r => r.requestor === filters.requestor);
    }
    
    if (filters.requestDateStart) {
      const startTime = filters.requestDateStart.getTime();
      filteredRequests = filteredRequests.filter(r => 
        new Date(r.requestDate).getTime() >= startTime
      );
    }
    
    if (filters.requestDateEnd) {
      const endTime = filters.requestDateEnd.getTime();
      filteredRequests = filteredRequests.filter(r => 
        new Date(r.requestDate).getTime() <= endTime
      );
    }
    
    if (filters.completedDateStart) {
      const startTime = filters.completedDateStart.getTime();
      filteredRequests = filteredRequests.filter(r => 
        r.completedDate && new Date(r.completedDate).getTime() >= startTime
      );
    }
    
    if (filters.completedDateEnd) {
      const endTime = filters.completedDateEnd.getTime();
      filteredRequests = filteredRequests.filter(r => 
        r.completedDate && new Date(r.completedDate).getTime() <= endTime
      );
    }
    
    return of(filteredRequests).pipe(
      delay(300) // Simulate network delay
    );
  }

  // Get available requestors for the filter dropdown
  public getRequestors(): Observable<string[]> {
    return of(ControllerRequestService.REQUESTORS);
  }

  // Get available controllers
  public getControllers(): Observable<{name: string, location: string}[]> {
    return of(ControllerRequestService.CONTROLLERS);
  }
} 