import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReminderService } from '../../services/reminder.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderDialogComponent } from './reminder-dialog/reminder-dialog';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './reminders.html',
  styleUrl: './reminders.css',
})
export class Reminders implements OnInit {
  private dialog = inject(MatDialog);

  reminders = signal<any[]>([]);
  loading = signal(false);

  constructor(private reminderService: ReminderService) {}

  ngOnInit(): void {
    this.loadReminders();
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
}
