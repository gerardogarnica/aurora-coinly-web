import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { checkToken } from '@core/interceptors/auth.interceptor';
import { ErrorsService } from '@core/services/errors.service';
import { CreateExpenseTransaction, CreateIncomeTransaction, PayPendingTransactions, Transaction } from '@features/transactions/models/transaction.model';
import { TransactionDateFilterType } from '@features/transactions/models/transaction.types';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/transactions';

  getTransactions(dateFrom: Date, dateTo: Date, dateType: TransactionDateFilterType) {
    let url = `${this.apiUrl}?from=${dateFrom.toISOString().slice(0, 10)}&to=${dateTo.toISOString().slice(0, 10)}&dt=${dateType}`;
    return this.httpClient.get<Transaction[]>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

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

  payPendingTransactions(payload: PayPendingTransactions) {
    let url = `${this.apiUrl}/pay`;
    return this.httpClient.put<void>(url, payload, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
