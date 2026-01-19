import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DoctorProfileService } from '../../services/doctor-profile.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  private readonly doctorProfileService = inject(DoctorProfileService);

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
}
