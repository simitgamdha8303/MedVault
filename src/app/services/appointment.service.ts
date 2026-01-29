import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/Appointment`;

  constructor(private http: HttpClient) {}

  book(payload: any) {
    return this.http.post<ApiResponse<string>>(this.baseUrl, payload);
  }

  getPatientAppointments() {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/patient`);
  }
}
