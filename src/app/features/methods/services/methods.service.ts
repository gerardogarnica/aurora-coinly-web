import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ErrorsService } from '@core/services/errors.service';
import { Method } from '../models/method.model';

@Injectable({
    providedIn: 'root'
})
export class MethodService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/methods';

  getMethod(id:string) {
    let url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Method>(url).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  getMethods(showDeleted: boolean) {
    let url = `${this.apiUrl}?deleted=${showDeleted}`;
    return this.httpClient.get<Method[]>(url).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  deleteMethod(id: string) {
    let url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete(url).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  setDefaultMethod(id: string) {
    let url = `${this.apiUrl}/${id}/default`;
    return this.httpClient.put(url, {}).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
