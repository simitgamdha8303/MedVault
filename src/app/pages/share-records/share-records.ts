import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { QrShareService } from '../../services/qr-share.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareRecordsDialog } from '../share-records-dialog/share-records-dialog';

@Component({
  selector: 'app-share-records',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './share-records.html',
  styleUrl: './share-records.css',
})
export class ShareRecords implements OnInit {
  private dialog = inject(MatDialog);
  private qrShareService = inject(QrShareService);
  private snackBar = inject(MatSnackBar);

  qrShares = signal<any[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadQrShares();
  }

  loadQrShares() {
    this.loading.set(true);

    this.qrShareService.getByPatient().subscribe({
      next: (res) => {
        this.qrShares.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openAddDialog() {
    const ref = this.dialog.open(ShareRecordsDialog, {
      width: '520px',
      disableClose: true,
    });

    ref.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadQrShares();
      }
    });
  }

  confirmDelete(id: string) {
    if (!confirm('Are you sure you want to revoke this QR share?')) return;

    this.qrShareService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('QR revoked successfully', 'Close', {
          duration: 1500,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.loadQrShares();
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

  getStatus(q: any): string {
    const now = new Date();
    const expiry = new Date(q.expiresAt);

    if (expiry < now) return 'Expired';
    if (q.isUsed) return 'Used';
    return 'Not Used';
  }
}
