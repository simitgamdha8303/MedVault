import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReminderService } from '../../services/reminder.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderDialogComponent } from './reminder-dialog/reminder-dialog';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './reminders.html',
  styleUrl: './reminders.css',
})
export class Reminders implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private readonly snackBar = inject(MatSnackBar);

  private sub?: Subscription;

  reminders = signal<any[]>([]);
  loading = signal(false);

  constructor(private reminderService: ReminderService) {}

  ngOnInit(): void {
    this.loadReminders();

    this.sub = this.snackbarService.reminderRefresh$.subscribe(() => {
      this.loadReminders();
    });
  }

  loadReminders() {
    this.loading.set(true);

    this.reminderService.getByPatient().subscribe({
      next: (res) => {
        this.reminders.set(res.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load reminders', err);
        this.loading.set(false);
      },
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '520px',
      disableClose: true,
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadReminders();
      }
    });
  }

  openEditDialog(reminderId: any) {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        id: reminderId,
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadReminders();
      }
    });
  }

   confirmDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this record?')) return;

    this.reminderService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Record delete successfully', 'Close', {
          duration: 1000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        this.loadReminders();
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
