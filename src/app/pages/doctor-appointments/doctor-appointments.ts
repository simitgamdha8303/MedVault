import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './doctor-appointments.html',
  styleUrl: './doctor-appointments.css',
})
export class DoctorAppointments implements OnInit {
  private appointmentService = inject(AppointmentService);
  private snackBar = inject(MatSnackBar);

  appointments = signal<any[]>([]);

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getDoctorAppointments().subscribe({
      next: res => this.appointments.set(res.data ?? []),
      error: () =>
        this.snackBar.open('Failed to load appointments', 'Close', { duration: 2000 }),
    });
  }

  approve(id: number) {
    this.appointmentService.approve(id).subscribe(() => {
      this.snackBar.open('Appointment confirmed', 'Close', { duration: 2000 });
      this.loadAppointments();
    });
  }

  reject(id: number) {
    this.appointmentService.reject(id).subscribe(() => {
      this.snackBar.open('Appointment rejected', 'Close', { duration: 2000 });
      this.loadAppointments();
    });
  }

  complete(id: number) {
    this.appointmentService.complete(id).subscribe(() => {
      this.snackBar.open('Appointment completed', 'Close', { duration: 2000 });
      this.loadAppointments();
    });
  }

  cancel(id: number) {
    this.appointmentService.cancelByDoctor(id).subscribe(() => {
      this.snackBar.open('Appointment cancelled', 'Close', { duration: 2000 });
      this.loadAppointments();
    });
  }
}
