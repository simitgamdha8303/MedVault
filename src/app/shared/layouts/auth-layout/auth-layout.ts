// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
// import { filter } from 'rxjs';

// @Component({
//   selector: 'app-auth-layout',
//   standalone: true,
//   imports: [RouterOutlet, CommonModule],
//   templateUrl: './auth-layout.html',
//   styleUrl: './auth-layout.css',
// })
// export class AuthLayout {
//   currentRole: string = 'patient';

//   constructor(private router: Router) {
//     // Listen to route changes to detect role switching
//     this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
//       this.detectRoleFromRoute();
//     });

//     // Initial detection
//     this.detectRoleFromRoute();
//   }

//   detectRoleFromRoute() {
//     // Check if URL contains 'doctor' to determine role
//     const url = this.router.url.toLowerCase();
//     this.currentRole = url.includes('doctor') ? 'doctor' : 'patient';
//   }

//   getAuthImage(): string {
//     if (this.currentRole === 'patient') {
//       return '/assets/images/auth_side_patient_image.jpg';
//     } else {
//       return '/assets/images/auth-side.jpg';
//     }
//   }

// }

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
