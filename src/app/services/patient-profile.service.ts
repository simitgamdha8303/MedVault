import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientprofileService {
  private baseUrl = `${environment.apiBaseUrl}/patient-profile`;

  constructor(private http: HttpClient) {}

  create(payload: any) {
    return this.http.post<any>(this.baseUrl, payload);
  }
}
