import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenService, TokenType } from '@core/services/token.service';

export const privateGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const hasAccessToken = tokenService.hasToken(TokenType.Access);
  const hasRefreshToken = tokenService.hasToken(TokenType.Refresh);

  if (!hasAccessToken && !hasRefreshToken) {
    router.navigate(['/auth']);
    return false;
  }

  return true;
};
