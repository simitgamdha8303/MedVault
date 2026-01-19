import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout implements OnDestroy {
  currentRole: string = 'patient';
  private roleService = inject(RoleService);
  private roleSubscription: Subscription;

  constructor() {
    // Subscribe to role changes
    this.roleSubscription = this.roleService.selectedRole$.subscribe((role) => {
      this.currentRole = role;
    });
  }

  getAuthImage(): string {
    if (this.currentRole === 'patient') {
      return '/assets/images/auth-patient-image.png';
    } else {
      return '/assets/images/auth-side.jpg';
    }
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }
}
