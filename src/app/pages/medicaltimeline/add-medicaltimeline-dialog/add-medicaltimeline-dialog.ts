import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DoctorProfileService } from '../../../services/doctor-profile.service';
import { MedicalTimelineService } from '../../../services/medical-timeline.service';
import { LookupService } from '../../../services/lookup.service';
import { DoctorProfile } from '../../../interfaces/doctor-profile';
import { EnumLookup } from '../../../interfaces/enum-lookup';

@Component({
  selector: 'app-add-medicaltimeline-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [MatNativeDateModule],
  templateUrl: './add-medicaltimeline-dialog.html',
  styleUrl: './add-medicaltimeline-dialog.css',
})
export class AddMedicaltimelineDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddMedicaltimelineDialogComponent>);
  private lookupService = inject(LookupService);
  private timelineService = inject(MedicalTimelineService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  checkupTypes: EnumLookup[] = [];
  doctors: DoctorProfile[] = [];

  form = this.fb.group({
    doctorProfileId: [null],
    doctorName: [''],
    checkupType: [null, Validators.required],
    eventDate: [null, Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadCheckupTypes();
    this.loadDoctors();
  }

  loadCheckupTypes(): void {
    this.lookupService.getCheckupTypes().subscribe((res) => {
      this.checkupTypes = res.data;
      this.cdr.detectChanges();
    });
  }

  loadDoctors(): void {
    this.lookupService.getAllDoctors().subscribe((res) => {
      this.doctors = res.data;
      this.cdr.detectChanges();
    });
  }

  onDoctorSelect(doctorId: number | null): void {
    const doctorNameCtrl = this.form.get('doctorName');

    if (doctorId) {
      // Doctor selected - disable manual name
      doctorNameCtrl?.clearValidators();
      doctorNameCtrl?.setValue(null);
      doctorNameCtrl?.disable();
    } else {
      // Manual doctor entry
      doctorNameCtrl?.setValidators(Validators.required);
      doctorNameCtrl?.enable();
    }

    doctorNameCtrl?.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

   const date = raw.eventDate as Date | null;

    const payload = {
      doctorProfileId: raw.doctorProfileId,
      doctorName: raw.doctorProfileId ? null : raw.doctorName,
      checkupType: raw.checkupType,
      eventDate: date ? date.toISOString().split('T')[0] : null,
      notes: raw.notes,
    };

    this.timelineService.create(payload).subscribe({
      next: () => {
        this.snackBar.open('Medical timeline created successfully', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        this.dialogRef.close(true);
      },
      error: (err) => {
        const apiError = err?.error;
        const message =
          apiError?.Errors?.[0] || apiError?.Message || 'Failed to create medical timeline';

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
