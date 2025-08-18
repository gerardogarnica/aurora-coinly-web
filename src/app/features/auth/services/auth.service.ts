import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ErrorsService } from '@core/services/errors.service';
import { IdentityToken } from '@features/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/auth';

  login(email: string, password: string) {
    let url = `${this.apiUrl}/login`;
    return this.httpClient.post<IdentityToken>(url, { email, password }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  refreshToken(refreshToken: string) {
    let url = `${this.apiUrl}/refresh`;
    return this.httpClient.post<IdentityToken>(url, { refreshToken }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
