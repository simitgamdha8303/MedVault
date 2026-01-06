import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class OtpGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userId = sessionStorage.getItem('otpUserId');

    if (!userId) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
