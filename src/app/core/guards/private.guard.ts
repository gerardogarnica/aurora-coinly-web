import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@features/auth/services/auth.service';
import { TokenService, TokenType } from '@core/services/token.service';

export const privateGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const hasAccessToken = tokenService.hasToken(TokenType.Access);
  if (!hasAccessToken) {
    const hasRefreshToken = tokenService.hasToken(TokenType.Refresh);
    if (!hasRefreshToken) {
      router.navigate(['/auth']);
      return false;
    }

    // Call refresh token endpoint
    const refreshToken = tokenService.getToken(TokenType.Refresh);
    if (!refreshToken) {
      router.navigate(['/auth']);
      return false;
    }

    authService.refreshToken(refreshToken).subscribe({
      next: () => {
        // Successfully refreshed token, allow access
      },
      error: () => {
        // Refresh failed, redirect to login
        router.navigate(['/auth']);
        return false;
      }
    });
  }

  // Allow access to the route
  return true;
};
