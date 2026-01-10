import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfileResponse } from '../interfaces/user-profile';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<UserProfileResponse> {
    return this.http.get<any>(`${this.apiUrl}/user/me`).pipe(map((res) => res.data));
  }

  updateTwoFactor(enabled: boolean) {
    return this.http.put<any>(`${this.apiUrl}/user/two-factor`, { enabled });
  }
}
