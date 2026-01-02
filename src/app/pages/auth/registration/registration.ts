import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
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
    RouterModule,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
    private auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  // signupForm: FormGroup;

  
    signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
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
    });
  

  submit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    // this.http.post('http://localhost:5128/api/User/register', this.signupForm.value).subscribe({
      this.auth.register(this.signupForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const response = err.error;
        console.log(response);
      },
    });
  }
}
