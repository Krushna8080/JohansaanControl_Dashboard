export interface ControllerRequest {
  id: string;
  controllerName: string;
  installLocation: string;
  requestDate: string;
  requestor: string;
  status: 'Processing' | 'Completed';
  completedDate?: string;
}

export interface ControllerHealth {
  id: string;
  controllerName: string;
  platform: string;
  dataReceived: number;
  dataExpected: number;
  points: ControllerPoint[];
}

export interface ControllerPoint {
  pointName: string;
  lastSample: string;
}

export interface WeatherData {
  day: string;
  location: string;
  highTemp: string;
  lowTemp: string;
} 