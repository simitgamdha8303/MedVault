import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppointmentService } from '../../../services/appointment.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-appointment-dialog',
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
    MatNativeDateModule,
  ],
  templateUrl: './appointment-dialog.html',
  styleUrl: './appointment-dialog.css',
})
export class AppointmentDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AppointmentDialogComponent>);
  private appointmentService = inject(AppointmentService);
  private lookupService = inject(LookupService);
  private snackBar = inject(MatSnackBar);

  doctors: any[] = [];
  checkupTypes: any[] = [];
  today = new Date(new Date().setHours(0, 0, 0, 0));

  appointmentForm: FormGroup = this.fb.group({
    doctorId: [null, Validators.required],
    checkupType: [null, Validators.required],
    appointmentDate: [null, Validators.required],
    appointmentTime: [
      '',
      [
        Validators.required,
        Validators.pattern('^([01]\\d|2[0-3]):([0-5]\\d)$'), // HH:mm
      ],
    ],
  });

  ngOnInit(): void {
    this.loadDoctors();
    this.loadCheckupTypes();
  }

  loadDoctors(): void {
    this.lookupService.getAllDoctors().subscribe((res) => {
      this.doctors = res.data ?? [];
    });
  }

  loadCheckupTypes(): void {
    this.lookupService.getCheckupTypes().subscribe((res) => {
      this.checkupTypes = res.data ?? [];
    });
  }

  submit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const v = this.appointmentForm.value;
    const [h, m] = v.appointmentTime.split(':');

    const date = new Date(v.appointmentDate);
    date.setHours(+h, +m, 0, 0);

    const payload = {
      doctorId: v.doctorId,
      checkupType: v.checkupType,
      appointmentDate: date.toISOString().split('T')[0],
      appointmentTime: `${v.appointmentTime}:00`,
    };

    this.appointmentService.book(payload).subscribe({
      next: () => {
        this.snackBar.open('Appointment booked successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        const msg =
          err?.error?.errors?.[0] ||
          err?.error?.message ||
          'Failed to book appointment';

        this.snackBar.open(msg, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
