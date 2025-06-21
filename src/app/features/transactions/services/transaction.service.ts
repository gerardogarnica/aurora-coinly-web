import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ErrorsService } from '@core/services/errors.service';
import { Transaction } from '@features/transactions/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/transactions';

  constructor() { }
}
