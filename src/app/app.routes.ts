import { Routes } from '@angular/router';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/auth/routes/auth.routes').then(m => m.AUTH_ROUTES),
      },
    ],
  },

  // fallback
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
