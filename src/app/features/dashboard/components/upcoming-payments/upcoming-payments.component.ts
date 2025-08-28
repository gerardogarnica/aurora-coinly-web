import { Component, Input } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { Transaction } from '@features/transactions/models/transaction.model';
import { CommonUtils } from '@shared/utils/common.utils';

import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-upcoming-payments',
  imports: [SharedModule, AvatarModule],
  templateUrl: './upcoming-payments.component.html'
})
export class UpcomingPaymentsComponent {
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
}
