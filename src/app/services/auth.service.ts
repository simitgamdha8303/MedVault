import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../interfaces/api-response';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:5128/api/Auth';

  constructor(private http: HttpClient) {}

  login(payload: any) {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}/login`,
      payload
    );
  }

  verifyOtp(payload: any) {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/verify-otp`,
      payload
    );
  }

  resendOtp(userId: string) {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/resend-otp`,
      { userId }
    );
  }

  register(payload: any) {
    return this.http.post(
      `http://localhost:5128/api/User/register`,
      payload
    );
  }
}
