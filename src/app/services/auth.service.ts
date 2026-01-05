import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../interfaces/api-response';
import { LoginResponse } from '../interfaces/login-response';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authUrl = `${environment.apiBaseUrl}/Auth`;
  private readonly userUrl = `${environment.apiBaseUrl}/User`;

  constructor(private http: HttpClient) {}

  login(payload: any) {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.authUrl}/login`, payload);
  }

  verifyOtp(payload: any) {
    return this.http.post<ApiResponse<string>>(`${this.authUrl}/verify-otp`, payload);
  }

  resendOtp(userId: string) {
    return this.http.post<ApiResponse<null>>(`${this.authUrl}/resend-otp`, { userId });
  }

  register(payload: any) {
    return this.http.post(`${this.userUrl}/register`, payload);
  }
}
