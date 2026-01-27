import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DoctorProfileService } from '../../services/doctor-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { PatientsDialog } from './patients-dialog/patients-dialog';
import { PatientprofileService } from '../../services/patient-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  private readonly doctorProfileService = inject(DoctorProfileService);
  private readonly patientProfileService = inject(PatientprofileService);
  private readonly snackBar = inject(MatSnackBar);


  private readonly dialog = inject(MatDialog);

  patients = signal<DoctorPatient[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    this.loading.set(true);

    this.doctorProfileService.getPatientsByDoctor().subscribe({
      next: (res) => {
        this.patients.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  openPatientDialog(patientId: any) {

    this.patientProfileService.getById(patientId).subscribe({
      next: (res) => {
        this.dialog.open(PatientsDialog, {
          width: '420px',
          disableClose: true,
          data: res.data,
        });
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
