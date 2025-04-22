import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  private userTimezone: string = 'UTC';
  private timezoneOffset: number = 0;
  private timezoneSubject = new BehaviorSubject<string>('');
  public timezone$ = this.timezoneSubject.asObservable();

  constructor(private http: HttpClient) {
    // Only use browser detection, no external API calls
    this.detectUserTimezone();
  }

  // Detect user's timezone
  private detectUserTimezone(): void {
    try {
      // Get user's timezone name (e.g., "America/New_York")
      this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Browser detected timezone:', this.userTimezone);
      
      // Get the timezone offset in minutes
      const date = new Date();
      this.timezoneOffset = date.getTimezoneOffset();
      
      // Update the display
      this.updateTimezoneDisplay();
    } catch (error) {
      console.error('Error detecting timezone:', error);
      // Default to UTC
      this.userTimezone = 'UTC';
      this.timezoneOffset = 0;
      this.timezoneSubject.next('UTC+00:00');
    }
  }

  // Update timezone display based on the current userTimezone
  private updateTimezoneDisplay(): void {
    try {
      // Get the timezone offset in minutes
      const offsetHours = Math.abs(Math.floor(this.timezoneOffset / 60));
      const offsetMinutes = Math.abs(this.timezoneOffset % 60);
      const sign = this.timezoneOffset <= 0 ? '+' : '-'; // Reversed because getTimezoneOffset returns opposite sign
      
      // Format for display (e.g., "UTC-05:00" for EST)
      const formattedTimezone = `UTC${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
      this.timezoneSubject.next(formattedTimezone);
      
      console.log('Formatted timezone display:', formattedTimezone);
    } catch (error) {
      console.error('Error updating timezone display:', error);
      this.timezoneSubject.next(this.userTimezone);
    }
  }

  // Get user's timezone
  public getUserTimezone(): string {
    return this.userTimezone;
  }

  // Get formatted timezone for display
  public getFormattedTimezone(): Observable<string> {
    return this.timezone$;
  }

  // Convert UTC date string to local date
  public utcToLocal(utcDateString: string): Date {
    try {
      const date = new Date(utcDateString);
      return date;
    } catch (error) {
      console.error('Error converting UTC to local:', error);
      return new Date();
    }
  }

  // Convert local date to UTC date string
  public localToUtc(localDate: Date): string {
    try {
      return localDate.toISOString();
    } catch (error) {
      console.error('Error converting local to UTC:', error);
      return new Date().toISOString();
    }
  }

  // Format date in the user's timezone
  public formatDate(dateString: string, language?: string): string {
    try {
      if (!dateString) {
        console.log('formatDate received empty date string');
        return '-';
      }
      
      console.log('Formatting date:', dateString);
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Invalid date';
      }
      
      // Format with date parts, no time parts
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: this.userTimezone
      };
      
      // Use provided language if available, otherwise fall back to browser language or 'en-US'
      const locale = language || navigator.language || 'en-US';
      
      const formatted = new Intl.DateTimeFormat(locale, options).format(date);
      return formatted;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }

  // Format date with only the time part
  public formatTime(dateString: string, language?: string): string {
    try {
      if (!dateString) {
        console.log('formatTime received empty date string');
        return '-';
      }
      
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Invalid time';
      }
      
      // Format with time parts only
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: this.userTimezone
      };
      
      // Use provided language if available, otherwise fall back to browser language or 'en-US'
      const locale = language || navigator.language || 'en-US';
      
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  }

  // Format date with both date and time parts
  public formatDateTime(dateString: string, language?: string): string {
    try {
      if (!dateString) {
        console.log('formatDateTime received empty date string');
        return '-';
      }
      
      console.log('Formatting datetime:', dateString);
      const date = new Date(dateString);
      console.log('Parsed date object:', date);
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Invalid date';
      }
      
      // Format with both date and time parts
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: this.userTimezone
      };
      
      // Use provided language if available, otherwise fall back to browser language or 'en-US'
      const locale = language || navigator.language || 'en-US';
      console.log('Using locale:', locale, 'with timezone:', this.userTimezone);
      
      const formatted = new Intl.DateTimeFormat(locale, options).format(date);
      console.log('Formatted result:', formatted);
      return formatted;
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return 'Invalid datetime';
    }
  }

  // Get the current date and time in the user's timezone
  public getCurrentLocalDateTime(): Date {
    return new Date();
  }
} 