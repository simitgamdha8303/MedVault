import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    email: ['', Validators.required], 
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.snackBar.open('Login successful', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        if (res.data.requiresOtp) {
          sessionStorage.setItem('otpUserId', String(res.data.userId));
          this.router.navigate(['/otp-verification']);
        } else {
          localStorage.setItem('token', res.data.token!);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        const apiError = err?.error;

        const message =
          apiError?.Errors?.[0] || 
          apiError?.Message ||
          'Invalid email or password'; 

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
