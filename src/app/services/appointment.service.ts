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

  update(id: number, payload: any) {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }

  getPatientAppointments() {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/patient`);
  }

  getDoctorAppointments() {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/doctor/pending`);
  }

  approve(id: number) {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${id}/approve`, {});
  }

  reject(id: number) {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${id}/reject`, {});
  }

  complete(id: number) {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${id}/complete`, {});
  }

  cancelByDoctor(id: number) {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
