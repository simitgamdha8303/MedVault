import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LookupService } from '../../services/lookup.service';
import { EnumLookup } from '../../interfaces/enum-lookup';
import { PatientprofileService } from '../../services/patient-profile.service';
import { Router } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-patientprofile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule
  ],
  providers: [MatNativeDateModule],
  templateUrl: './patientprofile.html',
  styleUrl: './patientprofile.css',
})
export class Patientprofile implements OnInit {
  private fb = inject(FormBuilder);
  private lookupService = inject(LookupService);
  private patientProfileService = inject(PatientprofileService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  genders: EnumLookup[] = [];
  bloodGroups: EnumLookup[] = [];
  today = new Date();

  patientProfileForm = this.fb.group({
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    bloodGroup: ['', Validators.required],
    allergies: [''],
    chronicCondition: [''],
    emergencyContactName: [''],
    emergencyContactPhone: [''],
  });

  ngOnInit(): void {
    this.loadLookups();
  }

  loadLookups() {
    this.lookupService.getGenders().subscribe((res) => {
      this.genders = res.data;
      this.cdr.detectChanges();
    });

    this.lookupService.getBloodGroups().subscribe((res) => {
      this.bloodGroups = res.data;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (this.patientProfileForm.invalid) return;

    const formValue = this.patientProfileForm.value;

    const payload = {
      ...formValue,
       dateOfBirth: this.formatDateOnly(formValue.dateOfBirth!)
    };

    this.patientProfileService.create(payload).subscribe({
      next: (res) => {
        this.snackBar.open(res.message ?? 'Profile created', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const message = err?.error?.errors?.[0] ?? 'Failed to create profile';

        this.snackBar.open(message, 'Close', {
          duration: 4000,
        });
      },
    });
  }

  private formatDateOnly(date: Date | string | null): string | null {
  if (!date) return null;

  const d = new Date(date);
  return d.toISOString().split('T')[0]; // yyyy-MM-dd
}

}
