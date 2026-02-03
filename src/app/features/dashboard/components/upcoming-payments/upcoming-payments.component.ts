import { Component, Input } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { DashboardTransaction } from '@features/dashboard/models/dashboard.model';
import { CommonUtils } from '@shared/utils/common.utils';

import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-upcoming-payments',
  imports: [SharedModule, AvatarModule],
  templateUrl: './upcoming-payments.component.html'
})
export class UpcomingPaymentsComponent {
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
}
