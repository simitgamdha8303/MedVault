import { Routes } from '@angular/router';
import { Registration } from '../registration/registration';
import { Login } from '../login/login';
import { OtpVerification } from '../otp-verification/otp-verification';
import { OtpGuard } from '../../../guards/otp.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: Registration,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'otp-verification',
    component: OtpVerification,
    canActivate: [OtpGuard],
  },
];
