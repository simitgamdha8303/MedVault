import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  const allowedRole = route.data?.['role'];
  const userRole = auth.getUserRole();
  if (allowedRole && userRole !== allowedRole) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};


