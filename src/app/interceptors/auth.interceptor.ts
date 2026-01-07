import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/auth/login']);
      }

      if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }

      return throwError(() => error);
    })
  );
};
