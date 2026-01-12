import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MedicaltimelineDialogComponent } from './medicaltimeline-dialog/medicaltimeline-dialog';
import { MedicalTimelineService } from '../../services/medical-timeline.service';
import { LookupService } from '../../services/lookup.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-medicaltimeline',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './medicaltimeline.html',
  styleUrl: './medicaltimeline.css',
})
export class Medicaltimeline implements OnInit {
  private dialog = inject(MatDialog);
  private timelineService = inject(MedicalTimelineService);
  private lookupService = inject(LookupService);
  private readonly snackBar = inject(MatSnackBar);
  private doctorSearchTimeout: any;

  timelines = signal<any[]>([]);

  checkupTypes: any[] = [];

  filters: TimelineFilters = {
    checkupType: null,
    fromDate: null,
    toDate: null,
    doctor: null,
  };

  ngOnInit(): void {
    this.loadCheckupTypes();
    this.loadTimelines();
  }

  loadCheckupTypes(): void {
    this.lookupService.getCheckupTypes().subscribe((res) => {
      this.checkupTypes = res.data;
    });
  }

  loadTimelines(): void {
    const payload = {
      checkupType: this.filters.checkupType,
      fromDate: this.filters.fromDate ? this.filters.fromDate.toISOString().split('T')[0] : null,
      toDate: this.filters.toDate ? this.filters.toDate.toISOString().split('T')[0] : null,
      doctor: this.filters.doctor,
    };
    this.timelineService.search(payload).subscribe((res) => {
      this.timelines.set(res.data);
    });
  }

  onDoctorFilterChange(): void {
    clearTimeout(this.doctorSearchTimeout);

    this.doctorSearchTimeout = setTimeout(() => {
      this.loadTimelines();
    }, 400);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(MedicaltimelineDialogComponent, {
      width: '520px',
      disableClose: true,
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTimelines();
      }
    });
  }

  openEditDialog(id: number): void {
    const dialogRef = this.dialog.open(MedicaltimelineDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        id: id,
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTimelines();
      }
    });
  }

  confirmDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this record?')) return;

    this.timelineService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Record delete successfully', 'Close', {
          duration: 1000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        this.loadTimelines();
      },
      error: (err) => {
        const apiError = err?.error;

        const message = apiError?.Errors?.[0] || apiError?.Message || 'Something went wrong!';

        this.snackBar.open(message, 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
