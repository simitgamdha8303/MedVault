import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QrShareService } from '../../services/qr-share.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { QrViewDialog } from './qr-view-dialog/qr-view-dialog';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-qr-shares',
  imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './qr-shares.html',
  styleUrl: './qr-shares.css',
})
export class QrShares {
  private qrShareService = inject(QrShareService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  qrShares = signal<any[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadQrShares();

    this.notificationService.qrShareUpdated$.subscribe(() => {
      this.loadQrShares();
    });
  }

  loadQrShares() {
    this.loading.set(true);

    this.qrShareService.getByDoctor().subscribe({
      next: (res) => {
        this.qrShares.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openQr(qrId: string) {
    this.qrShareService.getQrImage(qrId).subscribe({
      next: (blob) => {
        const imageUrl = URL.createObjectURL(blob);

        this.dialog.open(QrViewDialog, {
          width: '340px',
          data: { imageUrl, qrId },
        });
      },
      error: (err) => {
        const message = err?.error?.errors?.[0] || err?.error?.message || 'Failed to load QR code';

        this.snackBar.open(message, 'Close', {
          duration: 3500,
        });
      },
    });
  }
}
