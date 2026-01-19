import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorProfileService {
  private baseUrl = `${environment.apiBaseUrl}/doctor-profile`;

  constructor(private http: HttpClient) {}

  create(payload: any) {
    return this.http.post<any>(this.baseUrl, payload);
  }

  getPatientsByDoctor() {
    return this.http.get<any>(`${this.baseUrl}/patients`);
  }
}
