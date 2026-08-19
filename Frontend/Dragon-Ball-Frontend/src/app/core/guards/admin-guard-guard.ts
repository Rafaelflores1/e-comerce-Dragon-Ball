import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUserSignal();

  if (authService.isAuthenticated() && user?.rol === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};