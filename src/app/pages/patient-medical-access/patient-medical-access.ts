import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { QrShareService } from '../../services/qr-share.service';

@Component({
  selector: 'app-patient-medical-access',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './patient-medical-access.html',
  styleUrl: './patient-medical-access.css',
})
export class PatientMedicalAccess implements OnInit {

  // 🔹 SIGNAL STATE
  loading = signal<boolean>(true);
  data = signal<any | null>(null);

  // 🔹 DI
  private route = inject(ActivatedRoute);
  private qrShareService = inject(QrShareService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading.set(false);
      this.snackBar.open('Invalid access link', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.qrShareService.getPatientAccessByToken(token).subscribe({
      next: (res) => {
        this.data.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const msg =
          err?.error?.errors?.[0] ||
          'Unable to access patient medical records';
        this.snackBar.open(msg, 'Close', {
          duration: 4000,
        });
      },
    });
  }

  openDocument(url: string): void {
    window.open(url, '_blank');
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png'].includes(ext ?? '')) return 'image';
    return 'description';
  }
}
