import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { LookupService } from '../../services/lookup.service';
import { QrShareService } from '../../services/qr-share.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-records-dialog',
  standalone: true,
  templateUrl: './share-records-dialog.html',
  styleUrl: './share-records-dialog.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class ShareRecordsDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ShareRecordsDialog>);
  private lookupService = inject(LookupService);
  private qrShareService = inject(QrShareService);
  private snackBar = inject(MatSnackBar);

  doctors = signal<any[]>([]);

  form: FormGroup = this.fb.group({
    doctorId: [null, Validators.required],
    expiryMinutes: [10, Validators.required],
  });

  constructor() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.lookupService.getAllDoctors().subscribe({
      next: (res) => this.doctors.set(res.data ?? []),
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.qrShareService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('QR shared successfully', 'Close', {
          duration: 1500,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        const message =
          err?.error?.Errors?.[0] ||
          err?.error?.Message ||
          'Something went wrong';

        this.snackBar.open(message, 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
