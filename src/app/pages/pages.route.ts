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
import { Medicaltimeline } from './medicaltimeline/medicaltimeline';
import { Myprofile } from './myprofile/myprofile';
import { Patients } from './patients/patients';
import { Reminders } from './reminders/reminders';
import { PatientDashboard } from './patient-dashboard/patient-dashboard';
import { ShareRecords } from './share-records/share-records';

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
      { path: 'myprofile', component: Myprofile },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        component: Dashboard,
        data: { role: 'Doctor' },
      },

      {
        path: 'medicaltimeline',
        canActivate: [authGuard],
        component: Medicaltimeline,
        data: { role: 'Patient' },
      },
      {
        path: 'patients',
        canActivate: [authGuard],
        component: Patients,
        data: { role: 'Doctor' },
      },
      {
        path: 'reminders',
        canActivate: [authGuard],
        component: Reminders,
        data: { role: 'Patient' },
      },
      {
        path: 'share-records',
        canActivate: [authGuard],
        component: ShareRecords,
        data: { role: 'Patient' },
      },
      {
        path: 'patient-dashboard',
        canActivate: [authGuard],
        component: PatientDashboard,
        data: { role: 'Patient' },
      },
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
