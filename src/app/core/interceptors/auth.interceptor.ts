import { HttpContext, HttpContextToken, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { filter, switchMap, take, catchError } from 'rxjs/operators';

import { AuthService } from '@features/auth/services/auth.service';
import { TokenService, TokenType } from '@core/services/token.service';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(CHECK_TOKEN)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  const accessToken = tokenService.getToken(TokenType.Access);
  if (accessToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });

    return next(req);
  }

  // If no access token, check for refresh token
  const refreshToken = tokenService.getToken(TokenType.Refresh);
  if (!refreshToken) {
    return next(req);
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken(refreshToken).pipe(
      switchMap((token) => {
        isRefreshing = false;
        refreshTokenSubject.next(token.accessToken);

        // Update the request with the new access token
        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token.accessToken}` }
        });

        return next(clonedReq);
      }),
      catchError((error) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        return throwError(() => error);
      })
    );
  } else {
    // If already refreshing, wait for the new token
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(clonedReq);
      })
    );
  }
};
