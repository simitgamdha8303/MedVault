import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../interfaces/api-response';
import { LoginResponse } from '../interfaces/login-response';
import { environment } from '../../environments/environment';
import { OtpResponse } from '../interfaces/otp-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authUrl = `${environment.apiBaseUrl}/Auth`;
  private readonly userUrl = `${environment.apiBaseUrl}/User`;

  constructor(private http: HttpClient) {}

  login(payload: any) {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.authUrl}/login`, payload);
  }

  verifyOtp(payload: any) {
    return this.http.post<ApiResponse<OtpResponse>>(`${this.authUrl}/verify-otp`, payload);
  }

  resendOtp(userId: string) {
    return this.http.post<ApiResponse<null>>(`${this.authUrl}/resend-otp`, { userId });
  }

  register(payload: any) {
    return this.http.post(`${this.userUrl}/register`, payload);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  getUserName(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['name'] || null;
    } catch {
      return null;
    }
  }
}
