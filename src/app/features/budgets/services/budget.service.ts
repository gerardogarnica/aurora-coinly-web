import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { checkToken } from '@core/interceptors/auth.interceptor';
import { ErrorsService } from '@core/services/errors.service';
import { Budget, CreateBudget, UpdateBudget } from '@features/budgets/models/budget.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = `${environment.apiUrl}/aurora/coinly/budgets`;

  getBudgets(year: number) {
    return this.httpClient.get<Budget[]>(`${this.apiUrl}/year/${year}`, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  getBudgetById(id: string) {
    return this.httpClient.get<Budget>(`${this.apiUrl}/${id}`, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  createBudget(model: CreateBudget) {
    return this.httpClient.post<string>(this.apiUrl, model, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  updateBudget(id: string, model: UpdateBudget) {
    return this.httpClient.put(`${this.apiUrl}/${id}`, model, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
