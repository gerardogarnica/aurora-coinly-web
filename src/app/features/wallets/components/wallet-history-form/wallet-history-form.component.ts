import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { WalletTransactionModel } from '@features/wallets/models/wallet-transaction.model';
import { Wallet } from '@features/wallets/models/wallet.model';
import { WalletTransactionType } from '@features/wallets/models/wallet.types';
import { WalletService } from '@features/wallets/services/wallet.service';
import { ProcessStatus } from '@shared/models/process-status.model';
import { CommonUtils } from '@shared/utils/common.utils';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-wallet-history-form',
  imports: [CommonModule, FormsModule, ButtonModule, DatePickerModule, DialogModule, TableModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './wallet-history-form.component.html'
})
export class WalletHistoryFormComponent {
  @Input() wallet?: Wallet;
  @Input() showDialog: boolean = false;
  @Output() cancelAction = new EventEmitter<void>();

  private readonly walletService = inject(WalletService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  processStatus: ProcessStatus = 'none';
  dateRange: Date[] = [];
  transactions: WalletTransactionModel[] = [];
  maxDate: Date = CommonUtils.currentDate();

  showDialogForm() {
    this.maxDate = CommonUtils.currentDate();

    const today = CommonUtils.currentDate();
    const thirtyDaysAgo = CommonUtils.currentDate();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.dateRange = [thirtyDaysAgo, today];
    this.transactions = [];
    this.processStatus = 'init';

    this.onLoadHistory();
  }

  hideDialogForm() {
    this.transactions = [];
    this.dateRange = [];
    this.processStatus = 'none';
    this.showDialog = false;
    this.cancelAction.emit();
  }

  onLoadHistory() {
    if (this.dateRange.length < 2 || !this.dateRange[1] || !this.wallet) {
      return;
    }

    if (this.processStatus === 'loading') {
      return;
    }

    this.processStatus = 'loading';

    this.walletService
      .getWalletHistory(this.wallet.walletId, this.dateRange[0], this.dateRange[1])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.transactions = data.transactions ?? [];
          this.processStatus = 'success';
        },
        error: (error: string) => {
          this.processStatus = 'error';
          this.messageService.add({
            severity: 'error',
            summary: 'Error loading history',
            detail: error,
            life: 2000
          });
        }
      });
  }

  getTransactionTypeSeverity(type: WalletTransactionType): string {
    switch (type) {
      case WalletTransactionType.Deposit:
        return 'success';
      case WalletTransactionType.Withdrawal:
        return 'danger';
      case WalletTransactionType.AssignedToSavings:
        return 'secondary';
      case WalletTransactionType.AssignedToAvailable:
      case WalletTransactionType.Created:
        return 'info';
    }
  }
}
