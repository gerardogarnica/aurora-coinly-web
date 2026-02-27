import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionNotificationService {
  private transactionCreatedSubject = new Subject<void>();
  transactionCreated$ = this.transactionCreatedSubject.asObservable();

  notifyTransactionCreated() {
    this.transactionCreatedSubject.next();
  }
}
