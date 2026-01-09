import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicalTimelineService } from '../../../services/medical-timeline.service';
import { LookupService } from '../../../services/lookup.service';
import { DoctorProfile } from '../../../interfaces/doctor-profile';
import { EnumLookup } from '../../../interfaces/enum-lookup';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CloudinaryService } from '../../../services/cloudinary.service';

@Component({
  selector: 'app-medicaltimeline-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
  ],
  providers: [MatNativeDateModule],
  templateUrl: './medicaltimeline-dialog.html',
  styleUrl: './medicaltimeline-dialog.css',
})
export class MedicaltimelineDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MedicaltimelineDialogComponent>);
  private lookupService = inject(LookupService);
  private timelineService = inject(MedicalTimelineService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private data = inject(MAT_DIALOG_DATA);
  private cloudinaryService = inject(CloudinaryService);

  checkupTypes: EnumLookup[] = [];
  doctors: DoctorProfile[] = [];
  isEdit = false;
  timelineId!: number;
  today = new Date();

  form = this.fb.group({
    doctorProfileId: [0],
    doctorName: [''],
    checkupType: [0, Validators.required],
    eventDate: [null as Date | null, Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadCheckupTypes();
    this.loadDoctors();

    if (this.data?.mode === 'edit') {
      this.isEdit = true;
      this.timelineId = this.data.id;
      this.loadTimelineForEdit();
    }
  }

  loadTimelineForEdit(): void {
    this.timelineService.getById(this.timelineId).subscribe((res) => {
      const t = res.data;

      this.form.patchValue({
        doctorProfileId: t.doctorProfileId,
        doctorName: t.doctorName,
        checkupType: t.checkupTypeId,
        eventDate: new Date(t.eventDate),
        notes: t.notes,
      });

      this.onDoctorSelect(t.doctorProfileId);
      this.cdr.detectChanges();
    });
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

    this.uploadSelectedFiles();

    const raw = this.form.getRawValue();
    const date = raw.eventDate as Date | null;

    const payload = {
      doctorProfileId: raw.doctorProfileId,
      doctorName: raw.doctorProfileId ? null : raw.doctorName,
      checkupType: raw.checkupType,
      eventDate: date ? date.toISOString().split('T')[0] : null,
      notes: raw.notes,
    };

    const request$ = this.isEdit
      ? this.timelineService.update(this.timelineId, payload)
      : this.timelineService.create(payload);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit
            ? 'Medical timeline updated successfully'
            : 'Medical timeline created successfully',
          'Close',
          { duration: 2000, verticalPosition: 'top' }
        );

        this.dialogRef.close(true);
      },
      error: (err) => {
        const apiError = err?.error;
        const message = apiError?.Errors?.[0] || apiError?.Message || 'Operation failed';

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

  selectedFiles: File[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      // ✅ Size check (5MB)
      if (file.size <= 5 * 1024 * 1024) {
        this.selectedFiles.push(file);
      }
    });

    input.value = ''; // reset input
  }

  uploadSelectedFiles() {
    this.selectedFiles.forEach((file) => {
      this.cloudinaryService.uploadFile(file).subscribe((res: any) => {
        const fileUrl = res.secure_url;
        const fileName = file.name;

        this.saveDocument(fileUrl, fileName);
      });
    });
  }

  saveDocument(fileUrl: string, fileName: string) {
    const payload = {
      patientId: 1,
      medicalTimelineId: 10,
      documentTypeId: 3,
      documentDate: '2025-01-08',
      fileName,
      fileUrl,
    };

    console.log(payload);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
}
