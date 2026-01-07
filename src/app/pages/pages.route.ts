import { Routes } from '@angular/router';
import { AuthLayout } from '../shared/layouts/auth-layout/auth-layout';
import { Registration } from './auth/registration/registration';
import { Login } from './auth/login/login';
import { OtpVerification } from './auth/otp-verification/otp-verification';
import { OtpGuard } from '../guards/otp.guard';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from '../guards/auth.guard';
import { BaseLayout } from '../shared/layouts/main-layout/base-layout/base-layout';
import { guestGuard } from '../guards/guest.guard';
import { Doctorprofile } from './doctorprofile/doctorprofile';
import { Patientprofile } from './patientprofile/patientprofile';

export const PAGES_ROUTES: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },

      { path: 'register', component: Registration },

      { path: 'login', component: Login },

      {
        path: 'otp-verification',
        component: OtpVerification,
        canActivate: [OtpGuard],
      },
    ],
  },

  {
    path: '',
    component: BaseLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
    ],
  },

  {
    path: 'doctorprofile',
    component: AuthLayout,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
    children: [{ path: '', component: Doctorprofile }],
  },

  {
    path: 'patientprofile',
    component: AuthLayout,
    canActivate: [authGuard],
    data: { role: 'Patient' },
    children: [{ path: '', component: Patientprofile }],
  },
];
