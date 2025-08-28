import { Component, Input } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { Transaction } from '@features/transactions/models/transaction.model';
import { TransactionType } from '@features/transactions/models/transaction.types';
import { CommonUtils } from '@shared/utils/common.utils';

import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-recent-transactions',
  imports: [SharedModule, AvatarModule],
  templateUrl: './recent-transactions.component.html'
})
export class RecentTransactionsComponent {
  @Input() transactions: Transaction[] = new Array<Transaction>();

  getTransactionIconBackgroundColor(transaction: Transaction): string {
    return `${transaction.category.color}66`;
  }

  getTransactionIconTextColor(transaction: Transaction): string {
    return transaction.category.color;
  }

  getTransactionIcon(transaction: Transaction): string {
    return CommonUtils.getGroupIcon(transaction.category.group);
  }

  getTransactionAmountClass(transaction: Transaction): string {
    return transaction.type == TransactionType.Expense ? 'text-coinly-danger' : 'text-coinly-success';
  }
}
