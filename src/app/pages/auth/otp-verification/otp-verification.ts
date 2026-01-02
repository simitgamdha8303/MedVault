import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { ApiResponse } from '../../../interfaces/api-response';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css',
})
export class OtpVerification {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  otpForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    userId: [sessionStorage.getItem('otpUserId'), Validators.required],
  });

  submit(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.auth.verifyOtp(this.otpForm.value).subscribe({
      next: (res: ApiResponse<string>) => {
        this.snackBar.open('OTP verified successfully', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        localStorage.setItem('token', res.data);
        sessionStorage.removeItem('otpUserId');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const apiError = err?.error;

        const message = apiError?.Errors?.[0] || apiError?.Message || 'OTP is invalid or expired';

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  resendOtp(): void {
    const userId = sessionStorage.getItem('otpUserId');
    if (!userId) return;

    this.auth.resendOtp(userId).subscribe({
      next: (res) => {
        this.snackBar.open(res?.message || 'OTP sent successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        const apiError = err?.error;

        const message = apiError?.Errors?.[0] || apiError?.Message || 'Failed to resend OTP';

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
