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
}
