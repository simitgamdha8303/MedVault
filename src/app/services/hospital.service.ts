import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private baseUrl = `${environment.apiBaseUrl}/doctor-profile/list`;

  constructor(private http: HttpClient) {}

  getHospitals() {
    return this.http.get<any>(this.baseUrl);
  }
}
