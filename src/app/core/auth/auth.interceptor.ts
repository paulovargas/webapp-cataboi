import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/refresh') || req.url.includes('/auth/logout');
  const withAuthHeader = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(withAuthHeader).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      if (!isUnauthorized || isAuthRoute) {
        return throwError(() => error);
      }

      return authService.refreshSession().pipe(
        switchMap((ok) => {
          if (!ok) {
            return throwError(() => error);
          }

          const refreshedToken = authService.getToken();
          if (!refreshedToken) {
            return throwError(() => error);
          }

          const retriedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${refreshedToken}`,
            },
          });
          return next(retriedReq);
        })
      );
    })
  );
};
