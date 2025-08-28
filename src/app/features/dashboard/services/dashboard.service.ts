import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { checkToken } from '@core/interceptors/auth.interceptor';
import { ErrorsService } from '@core/services/errors.service';
import { DashboardSummary } from '@features/dashboard/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/dashboard';

  getDashboard() {
    return this.httpClient.get<DashboardSummary>(this.apiUrl, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
