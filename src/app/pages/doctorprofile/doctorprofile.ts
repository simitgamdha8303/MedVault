import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Hospital } from '../../interfaces/hospital';
import { MatSelectModule } from '@angular/material/select';
import { DoctorProfileService } from '../../services/doctor-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LookupService } from '../../services/lookup.service';

@Component({
  selector: 'app-doctorprofile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './doctorprofile.html',
  styleUrl: './doctorprofile.css',
})
export class Doctorprofile implements OnInit {
  private fb = inject(FormBuilder);
  private lookupService = inject(LookupService);
  private doctorProfileService = inject(DoctorProfileService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  hospitals: Hospital[] = [];

  doctorProfileForm = this.fb.group({
    hospitalId: ['', Validators.required],
    specialization: ['', Validators.required],
    licenseNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{2,3}[0-9]{5,7}$/)]],
  });

  ngOnInit(): void {
    this.loadHospitals();
  }

  loadHospitals() {
    this.lookupService.getHospitals().subscribe((res) => {
      this.hospitals = res.data;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (this.doctorProfileForm.invalid) return;

    const payload = this.doctorProfileForm.value;

    this.doctorProfileService.create(payload).subscribe({
      next: () => {
        this.snackBar.open('Doctor profile created successfully', 'Close', {
          duration: 3000,
        });

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const apiError = err?.error;

        const message = apiError?.Errors?.[0] || apiError?.Message || 'Something went wrong';

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
