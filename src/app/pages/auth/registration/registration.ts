import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
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
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly route = inject(ActivatedRoute);

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
    lastName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
    mobile: ['', [Validators.required, Validators.pattern('^[2-9][0-9]{9}$')]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ],
    ],
    role: [2],
  });

  selectedRole: 'doctor' | 'patient' = 'patient';

  ngOnInit(): void {
    const role = this.route.snapshot.queryParamMap.get('role');

    this.selectedRole = role === 'doctor' ? 'doctor' : 'patient';

    this.signupForm.patchValue({
      role: role === 'doctor' ? 1 : 2, // 1 = Doctor, 2 = Patient
    });
  }

  submit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.auth.register(this.signupForm.value).subscribe({
      next: () => {
        this.snackBar.open('Registration successful', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });

        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        const apiError = err?.error;

        const message =
          apiError?.Errors?.[0] || apiError?.Message || 'Registration failed. Try again.';

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
