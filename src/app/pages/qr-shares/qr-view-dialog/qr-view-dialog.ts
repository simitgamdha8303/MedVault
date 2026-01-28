import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { QrShareService } from '../../../services/qr-share.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-qr-view-dialog',
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './qr-view-dialog.html',
  styleUrl: './qr-view-dialog.css',
})
export class QrViewDialog {
  private dialogRef = inject(MatDialogRef<QrViewDialog>);
  data = inject(MAT_DIALOG_DATA);
  private qrShareService = inject(QrShareService);
  private snackBar = inject(MatSnackBar);

  openQrLink() {
    this.qrShareService.getQrToken(this.data.qrId).subscribe({
      next: (token) => {
        window.open(`/patient-medical-access?token=${encodeURIComponent(token)}`, '_blank');
      },
      error: (err) => {
        console.error(err);
        const msg = err?.error?.errors?.[0] || 'Unable to open patient access';
        this.snackBar.open(msg, 'Close', { duration: 3000 });
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
