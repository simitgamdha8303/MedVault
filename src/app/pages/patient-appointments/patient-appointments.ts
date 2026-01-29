import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './patient-appointments.html',
  styleUrl: './patient-appointments.css',
})
export class PatientAppointments implements OnInit {
  private dialog = inject(MatDialog);
  private appointmentService = inject(AppointmentService);
  private snackBar = inject(MatSnackBar);

  appointments = signal<any[]>([]);

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getPatientAppointments().subscribe({
      next: (res) => this.appointments.set(res.data ?? []),
      error: () =>
        this.snackBar.open('Failed to load appointments', 'Close', {
          duration: 2000,
        }),
    });
  }

  openBookDialog(): void {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '520px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((refresh) => {
      if (refresh) this.loadAppointments();
    });
  }
}
