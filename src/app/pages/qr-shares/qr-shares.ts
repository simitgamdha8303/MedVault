import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QrShareService } from '../../services/qr-share.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-qr-shares',
  imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './qr-shares.html',
  styleUrl: './qr-shares.css',
})
export class QrShares {
  private qrShareService = inject(QrShareService);
  private snackBar = inject(MatSnackBar);

  qrShares = signal<any[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadQrShares();
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
}
