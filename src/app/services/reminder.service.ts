import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private baseUrl = `${environment.apiBaseUrl}/reminder`;

  constructor(private http: HttpClient) {}

  getByPatient() {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/patient`);
  }

  getById(id: number) {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  create(payload: any) {
    return this.http.post<ApiResponse<number>>(this.baseUrl, payload);
  }

  update(id: number, payload: any) {
    return this.http.put<ApiResponse<number>>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
