import { Routes } from '@angular/router';
import { PAGES_ROUTES } from './pages/pages.route';

export const routes: Routes = [
  ...PAGES_ROUTES,

  // fallback
  {
    path: '**',
    redirectTo: '',
  },
];
