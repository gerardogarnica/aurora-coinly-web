import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ErrorsService } from '@core/services/errors.service';
import { TokenService, TokenType } from '@core/services/token.service';
import { IdentityToken } from '@features/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly tokenService = inject(TokenService);
  private readonly apiUrl = '/aurora/coinly/auth';

  login(email: string, password: string) {
    let url = `${this.apiUrl}/login`;
    return this.httpClient.post<IdentityToken>(url, { email, password }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error))),
      tap((token: IdentityToken) => {
        // Store tokens in token service
        this.tokenService.setToken(TokenType.Access, token.accessToken, token.accessTokenExpiresOn);
        this.tokenService.setToken(TokenType.Refresh, token.refreshToken, token.refreshTokenExpiresOn);
      })
    );
  }

  refreshToken(refreshToken: string) {
    let url = `${this.apiUrl}/refresh`;
    return this.httpClient.post<IdentityToken>(url, { refreshToken }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error))),
      tap((token: IdentityToken) => {
        // Update tokens in token service
        this.tokenService.setToken(TokenType.Access, token.accessToken, token.accessTokenExpiresOn);
        this.tokenService.setToken(TokenType.Refresh, token.refreshToken, token.refreshTokenExpiresOn);
      })
    );
  }

  logout() {
    // Remove tokens from token service
    this.tokenService.removeToken(TokenType.Access);
    this.tokenService.removeToken(TokenType.Refresh);
  }
}
