import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
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
import { ApiResponse } from '../../../interfaces/api-response';
import { DocumentService } from '../../../services/document.service';
import { DocumentResponse } from '../../../interfaces/document-response';
import { forkJoin, switchMap } from 'rxjs';

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
  private documentService = inject(DocumentService);

  checkupTypes: EnumLookup[] = [];
  doctors: DoctorProfile[] = [];
  isEdit = false;
  timelineId!: number;
  today = new Date();
  existingDocuments: DocumentResponse[] = [];
  selectedFiles: File[] = [];
  removedDocumentIds: number[] = [];

  form = this.fb.group({
    doctorProfileId: [null as number | null],
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

      // LOAD EXISTING DOCUMENTS
      this.existingDocuments = t.documentResponses ?? [];

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

    const raw = this.form.getRawValue();
    const date = raw.eventDate as Date | null;

    const payload = {
      doctorProfileId: raw.doctorProfileId,
      doctorName: raw.doctorProfileId ? null : raw.doctorName,
      checkupType: raw.checkupType,
      eventDate: raw.eventDate,
      notes: raw.notes,
    };

    if (this.isEdit) {
      this.timelineService.update(this.timelineId, payload).subscribe({
        next: () => {
          const operations = [];

          if (this.selectedFiles.length > 0) {
            operations.push(this.uploadSelectedFiles(this.timelineId));
          }

          if (this.removedDocumentIds.length > 0) {
            operations.push(this.deleteFiles(this.removedDocumentIds));
          }

          // If nothing async, close immediately
          if (operations.length === 0) {
            this.dialogRef.close(true);
            return;
          }

          // Wait for ALL async ops
          forkJoin(operations).subscribe({
            next: () => {
              this.snackBar.open('Medical timeline updated successfully', 'Close', {
                duration: 2000,
                verticalPosition: 'top',
              });
              this.dialogRef.close(true);
            },
            error: () => {
              this.snackBar.open('Operation failed', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
              });
            },
          });
        },
        error: (err) => this.handleError(err),
      });
    } else {
      this.timelineService.create(payload).subscribe({
        next: (res: ApiResponse<number>) => {
          const timelineId = res.data;

          if (this.selectedFiles.length > 0) {
            this.uploadSelectedFiles(timelineId).subscribe({
              next: () => {
                this.snackBar.open('Medical timeline created successfully', 'Close', {
                  duration: 2000,
                  verticalPosition: 'top',
                });
                this.dialogRef.close(true);
              },
              error: () => {
                this.snackBar.open('File upload failed', 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                });
              },
            });
          } else {
            this.snackBar.open('Medical timeline created successfully', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
            });
            this.dialogRef.close(true);
          }
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  close(): void {
    this.removedDocumentIds = [];
    this.selectedFiles = [];
    this.dialogRef.close();
  }

  deleteFiles(documentIds: number[]) {
    return this.documentService.deleteMany(documentIds);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const allowedTypes = ['image/jpg', 'image/png', 'application/pdf'];

    Array.from(input.files).forEach((file) => {
      // Size check (5MB)

      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Only JPG, PNG and PDF files are allowed', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size must be less than 5MB', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
        return;
      }

      this.selectedFiles.push(file);
    });

    input.value = ''; // reset input
  }

  removeExistingDocument(doc: DocumentResponse) {
    if (!this.removedDocumentIds.includes(doc.id)) {
      this.removedDocumentIds.push(doc.id);
    }
    this.existingDocuments = this.existingDocuments.filter((d) => d.id !== doc.id);
  }

  uploadSelectedFiles(timelineId: number) {
    return forkJoin(
      this.selectedFiles.map((file) =>
        this.cloudinaryService.uploadFile(file).pipe(
          switchMap((res: any) =>
            this.documentService.create({
              medicalTimelineId: timelineId,
              fileName: file.name,
              fileUrl: res.secure_url,
              documentDate: new Date(),
            })
          )
        )
      )
    );
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  private handleError(err: any): void {
    const apiError = err?.error;
    const message = apiError?.Errors?.[0] || apiError?.Message || 'Operation failed';

    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
