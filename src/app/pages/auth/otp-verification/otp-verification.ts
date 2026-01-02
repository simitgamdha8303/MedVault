import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface ApiResponse<T> {
  succeeded: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css',
})
export class OtpVerification {

  private auth = inject(AuthService);

  otpForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    const userId = sessionStorage.getItem('otpUserId');

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      userId: [userId, Validators.required],
    });
  }

  submit() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.http
      .post<ApiResponse<string>>('http://localhost:5128/api/Auth/verify-otp', this.otpForm.value)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.data);
          sessionStorage.removeItem('otpUserId');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          const message = err?.error?.message || 'OTP is invalid or expired';

          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  resendOtp(): void {
    const userId = sessionStorage.getItem('otpUserId');

    this.http
      // .post<ApiResponse<null>>('http://localhost:5128/api/Auth/resend-otp', { userId })
    // .subscribe({
     this.auth.verifyOtp(this.otpForm.value).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
        error: () => {
          this.snackBar.open('Failed to resend OTP', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
  }
}
