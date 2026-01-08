import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { EnumLookup } from '../interfaces/enum-lookup';

@Injectable({ providedIn: 'root' })
export class LookupService {
  private baseUrl = `${environment.apiBaseUrl}/Lookup`;

  constructor(private http: HttpClient) {}

  getGenders() {
    return this.http.get<ApiResponse<EnumLookup[]>>(`${this.baseUrl}/genders`);
  }

  getBloodGroups() {
    return this.http.get<ApiResponse<EnumLookup[]>>(`${this.baseUrl}/blood-groups`);
  }

  getCheckupTypes() {
    return this.http.get<ApiResponse<EnumLookup[]>>(`${this.baseUrl}/checkup-types`);
  }

  getAllDoctors() {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/doctors`);
  }

  getHospitals() {
    return this.http.get<any>(`${this.baseUrl}/hospitals`);
  }
}
