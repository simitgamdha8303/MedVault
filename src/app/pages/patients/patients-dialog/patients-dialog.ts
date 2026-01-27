import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EnumLookup } from '../../../interfaces/enum-lookup';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-patients-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, DatePipe],
  templateUrl: './patients-dialog.html',
  styleUrl: './patients-dialog.css',
})
export class PatientsDialog implements OnInit {
  private readonly lookupService = inject(LookupService);
  private dialogRef = inject(MatDialogRef<PatientsDialog>);
  patient = inject(MAT_DIALOG_DATA);

  genders = signal<EnumLookup[]>([]);
  bloodGroups = signal<EnumLookup[]>([]);

  ngOnInit() {
    this.loadLookups();
  }

  loadLookups() {
    this.lookupService.getGenders().subscribe((res) => {
      this.genders.set(res.data);
    });

    this.lookupService.getBloodGroups().subscribe((res) => {
      this.bloodGroups.set(res.data);
    });
  }

  getGenderName(value: number): string {
    return this.genders().find((g) => g.id === value)?.name || 'N/A';
  }

  getBloodGroupName(value: number): string {
    return this.bloodGroups().find((b) => b.id === value)?.name || 'N/A';
  }

  close() {
    this.dialogRef.close();
  }
}
