import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({ providedIn: 'root' })
export class MedicalTimelineService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/medical-timeline`;

  create(payload: any) {
    return this.http.post<ApiResponse<number>>(this.baseUrl, payload);
  }

  update(id: number, payload: any) {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, payload);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  search(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/patient`, payload);
  }
}
