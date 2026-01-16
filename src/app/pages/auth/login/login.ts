// import { CommonModule } from '@angular/common';
// import { Component, inject } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { Router, RouterModule } from '@angular/router';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// import { AuthService } from '../../../services/auth.service';
// import { LoginRequest } from '../../../interfaces/login-request';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatIconModule,
//     MatButtonModule,
//     RouterModule,
//     MatSnackBarModule,
//   ],
//   templateUrl: './login.html',
//   styleUrl: './login.css',
// })
// export class Login {
//   private readonly auth = inject(AuthService);
//   private readonly fb = inject(FormBuilder);
//   private readonly router = inject(Router);
//   private readonly snackBar = inject(MatSnackBar);

//   selectedRole: 'doctor' | 'patient' = 'patient';

//   switchRole(): void {
//     this.selectedRole = this.selectedRole === 'patient' ? 'doctor' : 'patient';
//   }

//   loginForm = this.fb.group({
//     email: ['', Validators.required],
//     password: ['', [Validators.required]],
//   });

//   goToRegister(): void {
//     this.router.navigate(['/auth/register'], {
//       queryParams: { role: this.selectedRole },
//     });
//   }

//   submit(): void {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     }

//     const payload: LoginRequest = {
//       email: this.loginForm.value.email!,
//       password: this.loginForm.value.password!,
//       role: this.selectedRole === 'doctor' ? 1 : 2,
//     };

//     this.auth.login(payload).subscribe({
//       next: (res) => {
//         this.snackBar.open('Login successful', 'Close', {
//           duration: 2000,
//           verticalPosition: 'top',
//           panelClass: ['success-snackbar'],
//         });

//         if (res.data.requiresOtp) {
//           sessionStorage.setItem('otpUserId', String(res.data.userId));
//           sessionStorage.setItem('otpRole', String(payload.role));
//           this.router.navigate(['/auth/otp-verification']);
//         } else {
//           localStorage.setItem('token', res.data.token!);
//           const userRole = this.auth.getUserRole();
//           if (res.data.requiresProfile) {
//             this.router.navigate(['/dashboard']);
//           } else {
//             if (userRole == "Doctor") {
//               this.router.navigate(['/doctorprofile']);
//             } else {
//               this.router.navigate(['/patientprofile']);
//             }
//           }
//         }
//       },
//       error: (err) => {
//         const apiError = err?.error;

//         const message = apiError?.Errors?.[0] || apiError?.Message || 'Invalid email or password';

//         this.snackBar.open(message, 'Close', {
//           duration: 3000,
//           verticalPosition: 'top',
//           panelClass: ['error-snackbar'],
//         });
//       },
//     });
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../interfaces/login-request';
import { RoleService } from '../../../services/role.service';

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
export class Login implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private roleService = inject(RoleService);

  selectedRole: 'doctor' | 'patient' = 'patient';

  switchRole(): void {
    this.selectedRole = this.selectedRole === 'patient' ? 'doctor' : 'patient';
    this.roleService.setSelectedRole(this.selectedRole);

    // Update URL with query parameter
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { role: this.selectedRole },
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit() {
    // Set initial role
    const role = this.route.snapshot.queryParamMap.get('role');
    if (role === 'doctor' || role === 'patient') {
      this.selectedRole = role;
    }
    this.roleService.setSelectedRole(this.selectedRole);
  }

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', [Validators.required]],
  });

  goToRegister(): void {
    this.router.navigate(['/auth/register'], {
      queryParams: { role: this.selectedRole },
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload: LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
      role: this.selectedRole === 'doctor' ? 1 : 2,
    };

    this.auth.login(payload).subscribe({
      next: (res) => {
        this.snackBar.open('Login successful', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        if (res.data.requiresOtp) {
          sessionStorage.setItem('otpUserId', String(res.data.userId));
          sessionStorage.setItem('otpRole', String(payload.role));
          this.router.navigate(['/auth/otp-verification']);
        } else {
          localStorage.setItem('token', res.data.token!);
          const userRole = this.auth.getUserRole();
          if (res.data.requiresProfile) {
            this.router.navigate(['/dashboard']);
          } else {
            if (userRole == 'Doctor') {
              this.router.navigate(['/doctorprofile']);
            } else {
              this.router.navigate(['/patientprofile']);
            }
          }
        }
      },
      error: (err) => {
        const apiError = err?.error;

        const message = apiError?.Errors?.[0] || apiError?.Message || 'Invalid email or password';

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
