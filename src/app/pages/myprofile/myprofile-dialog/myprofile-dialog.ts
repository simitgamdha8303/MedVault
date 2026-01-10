import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { UserProfileResponse } from '../../../interfaces/user-profile';

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

  // inject-only DI
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MyprofileDialog>);
  readonly data = inject<UserProfileResponse>(MAT_DIALOG_DATA);

  form!: FormGroup;

  isDoctor = false;
  isPatient = false;

  bloodGroups = [
    { label: 'A+', value: 1 },
    { label: 'A-', value: 2 },
    { label: 'B+', value: 3 },
    { label: 'B-', value: 4 },
    { label: 'AB+', value: 5 },
    { label: 'AB-', value: 6 },
    { label: 'O+', value: 7 },
    { label: 'O-', value: 8 },
  ];

  ngOnInit() {
    this.isDoctor = !!this.data.doctorProfile;
    this.isPatient = !!this.data.patientProfile;
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      email: [{ value: this.data.email, disabled: true }],
      mobile: [this.data.mobile, Validators.required],

      // Doctor fields
      specialization: [this.data.doctorProfile?.specialization || ''],
      licenseNumber: [this.data.doctorProfile?.licenseNumber || ''],
      hospitalName: [this.data.doctorProfile?.hospitalName || ''],

      // Patient fields
      dateOfBirth: [this.data.patientProfile?.dateOfBirth || null],
      gender: [this.data.patientProfile?.genderValue ?? null],
      bloodGroup: [this.data.patientProfile?.bloodGroupValue ?? null],
      allergies: [this.data.patientProfile?.allergies || ''],
      chronicCondition: [this.data.patientProfile?.chronicCondition || ''],
      emergencyContactName:
        [this.data.patientProfile?.emergencyContactName || ''],
      emergencyContactPhone:
        [this.data.patientProfile?.emergencyContactPhone || ''],
    });
  }

  submit() {
    if (this.form.invalid) return;

    const updatedProfile = {
      ...this.data,
      ...this.form.getRawValue(),
    };

    this.dialogRef.close(updatedProfile);
  }

  close() {
    this.dialogRef.close();
  }
}
