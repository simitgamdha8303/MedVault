import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicalTimelineService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/medical-timeline`;

  create(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: any) {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  search(filters: any) {
    const payload = {
      checkupType: filters.checkupType,
      doctorProfileId: filters.doctorId,
      fromDate: filters.fromDate ? filters.fromDate.toISOString().split('T')[0] : null,
      toDate: filters.toDate ? filters.toDate.toISOString().split('T')[0] : null,
    };

    return this.http.post<any>(`${this.baseUrl}/patient`, payload);
  }
}
