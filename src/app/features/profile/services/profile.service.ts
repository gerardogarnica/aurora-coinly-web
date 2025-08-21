import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { checkToken } from '@core/interceptors/auth.interceptor';
import { ErrorsService } from '@core/services/errors.service';
import { User } from '@features/profile/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/me';

  getProfile() {
    let url = `${this.apiUrl}`;
    return this.httpClient.get<User>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  updateProfile(firstName: string, lastName: string) {
    let url = `${this.apiUrl}/profile`;
    return this.httpClient.put(url, { firstName, lastName }, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
