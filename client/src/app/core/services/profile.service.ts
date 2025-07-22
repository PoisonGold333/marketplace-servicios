import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<any> {
    return this.http.get('/api/profile');
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put('/api/profile', data);
  }
}