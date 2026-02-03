import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  public data = inject(MAT_DIALOG_DATA);

  doctors: any[] = [];
  checkupTypes: any[] = [];
  today = new Date(new Date().setHours(0, 0, 0, 0));
  isEdit = false;
  appointmentId!: number;

  appointmentForm: FormGroup = this.fb.group({
    doctorId: [null, Validators.required],
    checkupType: [null, Validators.required],
    appointmentDate: [null, [Validators.required, this.noPastDateValidator()]],
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

    if (this.data) {
      this.isEdit = true;
      this.appointmentId = this.data.id;

      this.appointmentForm.patchValue({
        doctorId: this.data.doctorId,
        checkupType: this.data.checkupType,
        appointmentDate: new Date(this.data.appointmentDate),
        appointmentTime: this.data.appointmentTime.substring(0, 5),
      });

      this.appointmentForm.get('doctorId')?.disable();
    }
  }

  loadDoctors(): void {
    this.lookupService.getAllDoctors().subscribe((res) => {
      this.doctors = res.data ?? [];

      if (this.isEdit && this.data?.doctorId) {
        this.appointmentForm.patchValue({
          doctorId: this.data.doctorId,
        });

        this.appointmentForm.get('doctorId')?.disable();
      }
    });
  }

  loadCheckupTypes(): void {
    this.lookupService.getCheckupTypes().subscribe((res) => {
      this.checkupTypes = res.data ?? [];
    });
  }

  submit(): void {
    if (this.appointmentForm.invalid) return;

    const v = this.appointmentForm.getRawValue();

    const payload = {
      doctorId: v.doctorId,
      checkupType: v.checkupType,
      appointmentDate: this.toLocalDateString(v.appointmentDate),
      appointmentTime: `${v.appointmentTime}:00`,
    };

    const request$ = this.isEdit
      ? this.appointmentService.update(this.appointmentId, payload)
      : this.appointmentService.book(payload);

    request$.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Appointment updated' : 'Appointment booked', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Action failed', 'Close', { duration: 3000 });
      },
    });
  }

  private toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private noPastDateValidator() {
    return (control: any) => {
      if (!control.value) return null;

      const selected = new Date(control.value);
      selected.setHours(0, 0, 0, 0);

      return selected < this.today ? { pastDate: true } : null;
    };
  }

  close(): void {
    this.dialogRef.close();
  }
}
