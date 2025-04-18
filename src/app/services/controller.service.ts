import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControllerRequest, ControllerHealth, WeatherData } from '../models/controller.model';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  private mockRequests: ControllerRequest[] = [
    {
      id: '1',
      controllerName: 'NAE45-2',
      installLocation: 'Intelligent Building Platform >> Building',
      requestDate: '12/25/25 1:00:00 PM',
      requestor: 'User Name',
      status: 'Processing'
    },
    {
      id: '2',
      controllerName: 'NAE45-2',
      installLocation: 'Intelligent Building Platform >> Building',
      requestDate: '12/24/25 1:00:00 PM',
      requestor: 'User Name',
      status: 'Completed',
      completedDate: '12/24/25 2:05:00 PM'
    },
    {
      id: '3',
      controllerName: 'NAE45-2',
      installLocation: 'Intelligent Building Platform >> Building',
      requestDate: '12/24/25 1:00:00 PM',
      requestor: 'User Name',
      status: 'Completed',
      completedDate: '12/24/25 2:05:00 PM'
    }
  ];

  private mockControllerHealth: ControllerHealth = {
    id: 'NAE45-2',
    controllerName: 'NAE45-2',
    platform: 'Intelligent Building Platform',
    dataReceived: 6,
    dataExpected: 6,
    points: [
      { pointName: 'Point Name Goes Here', lastSample: '12/24/25 1:00:00 PM' },
      { pointName: 'Point Name Goes Here', lastSample: '12/24/25 1:00:00 PM' },
      { pointName: 'Point Name Goes Here', lastSample: '12/24/25 1:00:00 PM' },
      { pointName: 'Point Name Goes Here', lastSample: '12/24/25 1:00:00 PM' },
      { pointName: 'Point Name Goes Here', lastSample: '12/24/25 1:00:00 PM' },
      { pointName: 'Point Name Goes Here', lastSample: '12/24/25 1:00:00 PM' }
    ]
  };

  private weatherData: WeatherData[] = [
    { day: 'Yesterday', location: 'Sun Valley Mall', highTemp: '68°F', lowTemp: '52°F' },
    { day: 'Today', location: 'Sun Valley Mall', highTemp: '70°F', lowTemp: '53°F' },
    { day: 'Yesterday', location: 'Sun Valley Mall', highTemp: '68°F', lowTemp: '51°F' }
  ];

  constructor() { }

  getControllerRequests(): Observable<ControllerRequest[]> {
    return of(this.mockRequests);
  }

  getControllerHealth(id: string): Observable<ControllerHealth> {
    return of(this.mockControllerHealth);
  }

  getWeatherData(): Observable<WeatherData[]> {
    return of(this.weatherData);
  }

  addControllerRequest(request: Partial<ControllerRequest>): Observable<ControllerRequest> {
    const newRequest: ControllerRequest = {
      id: (this.mockRequests.length + 1).toString(),
      controllerName: request.controllerName || '',
      installLocation: 'Intelligent Building Platform >> Building',
      requestDate: new Date().toLocaleString(),
      requestor: 'User Name',
      status: 'Processing'
    };
    
    this.mockRequests.unshift(newRequest);
    return of(newRequest);
  }
}
