import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserProfileResponse } from '../../interfaces/user-profile';
import { UserService } from '../../services/user.service';
import { MyprofileDialog } from './myprofile-dialog/myprofile-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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

    // Optimistic UI update
    this.user.twoFactorEnabled = newValue;
    this.cdr.detectChanges();

    this.userService.updateTwoFactor(newValue).subscribe({
      next: () => {
        // success → nothing else needed
      },
      error: () => {
        // rollback if API fails
        this.user.twoFactorEnabled = previousValue;
        this.cdr.detectChanges();
        alert('Failed to update two-factor authentication');
      },
    });
  }

editProfile() {
  this.dialog.open(MyprofileDialog, {
    width: '720px',
    maxHeight: '90vh',
    data: this.user
  });
}

}
