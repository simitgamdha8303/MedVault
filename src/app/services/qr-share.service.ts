import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({ providedIn: 'root' })
export class QrShareService {
  private baseUrl = `${environment.apiBaseUrl}/qr-share`;

  constructor(private http: HttpClient) {}

  getByPatient() {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/patient`);
  }

  getByDoctor() {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/doctor`);
  }

  getById(id: string) {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  create(payload: any) {
    return this.http.post<ApiResponse<string>>(this.baseUrl, payload);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
