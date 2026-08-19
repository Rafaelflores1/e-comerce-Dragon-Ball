import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


export const authGuardTsGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if(authService.isAuthenticated()){
    return true
  }
  return router.createUrlTree(['/auth/login'],{
    queryParams: {returnUrl:state.url}
  })
};
