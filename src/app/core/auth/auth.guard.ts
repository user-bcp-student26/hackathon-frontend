import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthSessionService } from './auth-session.service';

export const authGuard: CanActivateFn = () => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  return authSession.isAuthenticated()
    ? true
    : router.createUrlTree(['/ingresar']);
};