import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { UserProfileResponse } from '../../../interfaces/user-profile';
import { LookupService } from '../../../services/lookup.service';
import { EnumLookup } from '../../../interfaces/enum-lookup';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-myprofile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './myprofile-dialog.html',
  styleUrls: ['./myprofile-dialog.css'],
})
export class MyprofileDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MyprofileDialog>);
  readonly data = inject<UserProfileResponse>(MAT_DIALOG_DATA);
  private lookupService = inject(LookupService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;

  isDoctor = false;
  isPatient = false;

  genders: EnumLookup[] = [];
  bloodGroups: EnumLookup[] = [];
  hospitals: EnumLookup[] = [];

  ngOnInit() {
    this.isDoctor = !!this.data.doctorProfile;
    this.isPatient = !!this.data.patientProfile;

    this.loadLookups();
    this.buildForm();
  }

  private loadLookups() {
    this.lookupService.getGenders().subscribe((res) => {
      this.genders = res.data;
    });

    this.lookupService.getBloodGroups().subscribe((res) => {
      this.bloodGroups = res.data;
    });

    this.lookupService.getHospitals().subscribe((res) => {
      this.hospitals = res.data;
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      firstName: [this.data.firstName, [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      lastName: [this.data.lastName, [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      email: [{ value: this.data.email, disabled: true }],
      mobile: [this.data.mobile, [Validators.required, Validators.pattern('^[2-9][0-9]{9}$')]],

      // Doctor fields
      specialization: [this.data.doctorProfile?.specialization || ''],
      licenseNumber: [
        this.data.doctorProfile?.licenseNumber || '',
        Validators.pattern(/^[A-Z]{2,3}[0-9]{5,7}$/),
      ],
      hospitalId: [this.data.doctorProfile?.hospitalId || ''],

      // Patient fields
      dateOfBirth: [this.data.patientProfile?.dateOfBirth || null],
      gender: [this.data.patientProfile?.gender ?? null],
      bloodGroup: [this.data.patientProfile?.bloodGroup ?? null],
      allergies: [this.data.patientProfile?.allergies || ''],
      chronicCondition: [this.data.patientProfile?.chronicCondition || ''],
      emergencyContactName: [
        this.data.patientProfile?.emergencyContactName || '',
        Validators.pattern('^[A-Za-z]+$'),
      ],
      emergencyContactPhone: [
        this.data.patientProfile?.emergencyContactPhone || '',
        Validators.pattern('^[2-9][0-9]{9}$'),
      ],
    });
  }

  submit() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const payload = {
      email: raw.email,
      firstName: raw.firstName,
      lastName: raw.lastName,
      mobile: raw.mobile,

      specialization: this.isDoctor ? raw.specialization : null,
      licenseNumber: this.isDoctor ? raw.licenseNumber : null,
      hospitalId: this.isDoctor ? raw.hospitalId : null,

      dateOfBirth: this.isPatient ? raw.dateOfBirth : null,
      gender: this.isPatient ? raw.gender : null,
      bloodGroup: this.isPatient ? raw.bloodGroup : null,
      allergies: this.isPatient ? raw.allergies : null,
      chronicCondition: this.isPatient ? raw.chronicCondition : null,
      emergencyContactName: this.isPatient ? raw.emergencyContactName : null,
      emergencyContactPhone: this.isPatient ? raw.emergencyContactPhone : null,
    };

    this.userService.updateProfile(payload).subscribe({
      next: () => {
        this.snackBar.open('My Profile updated successfully', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        const apiError = err?.error;
        const message = apiError?.Errors?.[0] || apiError?.Message || 'Something went wrong!';

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  close() {
    this.dialogRef.close();
  }

  private formatDateOnly(date: Date | string | null): string | null {
    if (!date) return null;

    const d = new Date(date);
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  }
}
