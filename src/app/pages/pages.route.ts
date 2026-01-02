import { Routes } from '@angular/router';

import { AuthLayout } from '../shared/layouts/auth-layout/auth-layout';

import { Registration } from './auth/registration/registration';
import { Login } from './auth/login/login';
import { OtpVerification } from './auth/otp-verification/otp-verification';

import { OtpGuard } from '../guards/otp.guard';
import { Dashboard } from './dashboard/dashboard';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },

      { path: 'register', component: Registration },

      { path: 'login', component: Login },

      {
        path: 'otp-verification',
        component: OtpVerification,
        canActivate: [OtpGuard],
        },
      
        { path: 'dashboard', component: Dashboard },

    ],
  },
];
