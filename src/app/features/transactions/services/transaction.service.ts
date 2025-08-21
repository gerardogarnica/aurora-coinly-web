import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { checkToken } from '@core/interceptors/auth.interceptor';
import { ErrorsService } from '@core/services/errors.service';
import { CreateExpenseTransaction, CreateIncomeTransaction, Transaction } from '@features/transactions/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/transactions';

  createExpense(transaction: CreateExpenseTransaction) {
    let url = `${this.apiUrl}/expense`;
    return this.httpClient.post<string>(url, transaction, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  createIncome(transaction: CreateIncomeTransaction) {
    let url = `${this.apiUrl}/income`;
    return this.httpClient.post<string>(url, transaction, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
