import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { checkToken } from '@core/interceptors/auth.interceptor';
import { ErrorsService } from '@core/services/errors.service';
import { CreateMethod, Method, UpdateMethod } from '@features/methods/models/method.model';

@Injectable({
  providedIn: 'root'
})
export class MethodService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/methods';

  getMethod(id: string) {
    let url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Method>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  getMethods(showDeleted: boolean) {
    let url = `${this.apiUrl}?deleted=${showDeleted}`;
    return this.httpClient.get<Method[]>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  createMethod(paymentMethod: CreateMethod) {
    return this.httpClient.post<string>(this.apiUrl, paymentMethod, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  updateMethod(paymentMethod: UpdateMethod) {
    let url = `${this.apiUrl}/${paymentMethod.paymentMethodId}`;
    return this.httpClient.put(url, paymentMethod, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  deleteMethod(id: string) {
    let url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  setDefaultMethod(id: string) {
    let url = `${this.apiUrl}/${id}/default`;
    return this.httpClient.put(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
