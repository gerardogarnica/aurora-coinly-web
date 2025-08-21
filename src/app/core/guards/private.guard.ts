import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenService, TokenType } from '@core/services/token.service';

export const privateGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

    const hasToken = tokenService.hasToken(TokenType.Access);
    if (!hasToken) {
    // If access token does not exist, redirect to login
    router.navigate(['/auth']);
    return false;
  }

  // Allow access to the route
  return true;
};
