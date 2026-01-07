import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { EnumLookup } from '../interfaces/enum-lookup';

@Injectable({ providedIn: 'root' })
export class LookupService {
  private baseUrl = `${environment.apiBaseUrl}/patient-profile`;

  constructor(private http: HttpClient) {}

  getGenders() {
    return this.http.get<ApiResponse<EnumLookup[]>>(`${this.baseUrl}/genders`);
  }

  getBloodGroups() {
    return this.http.get<ApiResponse<EnumLookup[]>>(`${this.baseUrl}/blood-groups`);
  }
}
