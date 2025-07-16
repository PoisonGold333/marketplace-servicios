import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private apiUrl = 'http://localhost:5000/api/availability';

  constructor(private http: HttpClient) {}

  getAvailability(providerId: string) {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/${providerId}`);
  }

  setAvailability(providerId: string, slots: any[]) {
    return this.http.post(`${this.apiUrl}/${providerId}`, { slots });
  }
}