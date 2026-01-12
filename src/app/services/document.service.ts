import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/medical-timeline`;

    create(payload: any) {
    return this.http.post<ApiResponse<number>>(`${this.baseUrl}/patient-document`, payload);
  }
}
