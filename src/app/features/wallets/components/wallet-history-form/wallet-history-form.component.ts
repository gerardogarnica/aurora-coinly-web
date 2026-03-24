import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-wallet-history-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DatePickerModule, DialogModule, SelectModule, TableModule, TagModule, ToastModule],
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
  private readonly formBuilder = inject(FormBuilder);

  processStatus: ProcessStatus = 'none';
  transactions: WalletTransactionModel[] = [];
  maxDate: Date = CommonUtils.currentDate();

  dateRangeOptions = [
    { label: 'This month', value: 'thisMonth' },
    { label: 'Past month', value: 'pastMonth' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'Last 90 days', value: 'last90days' },
    { label: 'Custom', value: 'custom' }
  ];

  historyFilterForm: FormGroup = this.formBuilder.group({
    rangeKey: ['last30days'],
    dateRange: [{ value: [], disabled: true }]
  });

  showDialogForm() {
    this.maxDate = CommonUtils.currentDate();
    this.transactions = [];
    this.processStatus = 'init';

    this.historyFilterForm.reset({ rangeKey: 'last30days', dateRange: [] });
    this.historyFilterForm.get('dateRange')?.disable();

    this.setDateRange('last30days');
  }

  hideDialogForm() {
    this.transactions = [];
    this.processStatus = 'none';
    this.showDialog = false;
    this.cancelAction.emit();
  }

  onDateRangeChange(event: any) {
    const rangeKey = event.value;
    const dateRangeControl = this.historyFilterForm.get('dateRange');

    if (rangeKey === 'custom') {
      dateRangeControl?.enable();
    } else {
      dateRangeControl?.disable();
      this.setDateRange(rangeKey);
    }
  }

  setDateRange(rangeKey: string) {
    const today = CommonUtils.currentDate();
    let startDate: Date = CommonUtils.currentDate();
    let endDate: Date = CommonUtils.currentDate();

    switch (rangeKey) {
      case 'custom':
        startDate = this.historyFilterForm.get('dateRange')!.value[0];
        endDate = this.historyFilterForm.get('dateRange')!.value[1];

        if (!startDate || !endDate) {
          return;
        }
        break;

      case 'pastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case 'last30days':
        startDate.setDate(endDate.getDate() - 30);
        break;

      case 'last90days':
        startDate.setDate(endDate.getDate() - 90);
        break;

      case 'thisMonth':
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
    }

    this.historyFilterForm.get('dateRange')!.setValue([startDate, endDate]);
    this.onLoadHistory();
  }

  onLoadHistory() {
    const [startDate, endDate] = this.historyFilterForm.get('dateRange')?.value ?? [];

    if (!startDate || !endDate || !this.wallet) {
      return;
    }

    if (this.processStatus === 'loading') {
      return;
    }

    this.processStatus = 'loading';

    this.walletService
      .getWalletHistory(this.wallet.walletId, startDate, endDate)
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
      default:
        return 'info';
    }
  }
}
