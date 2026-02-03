import { Component, Input } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { DashboardTransaction } from '@features/dashboard/models/dashboard.model';
import { TransactionStatus, TransactionType } from '@features/transactions/models/transaction.types';
import { CommonUtils } from '@shared/utils/common.utils';

import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-recent-transactions',
  imports: [SharedModule, AvatarModule, TagModule],
  templateUrl: './recent-transactions.component.html'
})
export class RecentTransactionsComponent {
  @Input() transactions: DashboardTransaction[] = new Array<DashboardTransaction>();

  getTransactionIconBackgroundColor(transaction: DashboardTransaction): string {
    return `${transaction.category.color}66`;
  }

  getTransactionIconTextColor(transaction: DashboardTransaction): string {
    return transaction.category.color;
  }

  getTransactionIcon(transaction: DashboardTransaction): string {
    return CommonUtils.getGroupIcon(transaction.category.group);
  }

  getTransactionAmountClass(transaction: DashboardTransaction): string {
    return transaction.type == TransactionType.Expense ? 'text-coinly-danger' : 'text-coinly-success';
  }

  getTransactionStatusSeverity(status: TransactionStatus): string {
    return status === TransactionStatus.Pending ? 'warn' : 'success';
  }
}
