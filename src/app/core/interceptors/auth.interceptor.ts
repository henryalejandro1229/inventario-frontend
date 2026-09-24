import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { showNotifyError, showNotifyWarning } from '../../shared/utils/sweetalert';

let isHandlingUnauthorized = false;
let isHandlingForbidden = false;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  const token = tokenStorage.getToken();
  const isLoginRequest = request.url.includes('/api/auth/login');
  const authenticatedRequest = token && !isLoginRequest
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isLoginRequest && !isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        tokenStorage.removeToken();
        void showNotifyError('Tu sesión ha expirado. Inicia sesión nuevamente.');
        void router.navigate(['/login']);
        setTimeout(() => { isHandlingUnauthorized = false; }, 2000);
      }
      if (error.status === 403 && !isHandlingForbidden) {
        isHandlingForbidden = true;
        void showNotifyWarning('No tienes permisos para realizar esta operación.');
        setTimeout(() => { isHandlingForbidden = false; }, 2000);
      }
      return throwError(() => error);
    })
  );
};
