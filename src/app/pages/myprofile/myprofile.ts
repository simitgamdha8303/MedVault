import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserProfileResponse } from '../../interfaces/user-profile';
import { UserService } from '../../services/user.service';
import { MyprofileDialog } from './myprofile-dialog/myprofile-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSlideToggleModule, MatDialogModule, MatIconModule],
  templateUrl: './myprofile.html',
  styleUrls: ['./myprofile.css'],
})
export class Myprofile implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  user!: UserProfileResponse;
  loading = true;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleTwoFactor() {
    const previousValue = this.user.twoFactorEnabled;
    const newValue = !previousValue;

    this.user.twoFactorEnabled = newValue;
    this.cdr.detectChanges();

    this.userService.updateTwoFactor(newValue).subscribe({
      next: () => {
        this.snackBar.open('Two Factor update successfully!', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
      error: () => {
        this.user.twoFactorEnabled = previousValue;
        this.cdr.detectChanges();
        alert('Failed to update two-factor authentication');
      },
    });
  }

  editProfile() {
    const dialogRef = this.dialog.open(MyprofileDialog, {
      width: '720px',
      maxHeight: '90vh',
      data: this.user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProfile();
      }
    });
  }
}
