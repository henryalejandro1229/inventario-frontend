import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

export const authGuard: CanActivateFn = (_, state) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  return tokenStorage.hasToken()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
