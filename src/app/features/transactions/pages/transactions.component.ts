import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { PayTransactionsFormComponent } from '@features/transactions/components/pay-transactions-form/pay-transactions-form.component';
import { Transaction } from '@features/transactions/models/transaction.model';
import { TransactionDateFilterType, TransactionStatus, TransactionType } from '@features/transactions/models/transaction.types';
import { TransactionService } from '@features/transactions/services/transaction.service';
import { WalletType } from '@features/wallets/models/wallet.types';
import { PageHeaderComponent } from '@shared/components/page-header.component';
import { CommonUtils } from '@shared/utils/common.utils';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

export interface GroupedTransaction {
  date: string;
  transactions: Transaction[];
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [PayTransactionsFormComponent, CommonModule, FormsModule, ReactiveFormsModule, PageHeaderComponent, AvatarModule, ButtonModule, CheckboxModule, ConfirmDialog, DatePicker, SelectModule, TagModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './transactions.component.html'
})
export default class TransactionsComponent {
  transactionService = inject(TransactionService);
  formBuilder = inject(FormBuilder);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  errorMessage = signal<string | null>(null);
  groupedTransactions = signal<GroupedTransaction[]>([]);
  selectedTransactions = signal<Transaction[]>([]);

  dateRangeOptions: any[] = [
    { label: 'This month', value: 'thisMonth' },
    { label: 'Past month', value: 'pastMonth' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'Last 90 days', value: 'last90days' },
    { label: 'Custom', value: 'custom' }
  ];
  showPayTransactionDialog = false;

  TransactionStatus = TransactionStatus;

  transactionSearchForm: FormGroup = this.formBuilder.group({
    rangeKey: ['thisMonth', Validators.required],
    dateRange: [[{ value: [], disabled: true }], Validators.required]
  });

  ngOnInit() {
    const rangeKey = this.transactionSearchForm.get('rangeKey')!.value;
    const dateRangeControl = this.transactionSearchForm.get('dateRange');

    if (rangeKey === 'custom') {
      dateRangeControl?.enable();
    } else {
      dateRangeControl?.disable();
      this.setDateRange(rangeKey);
    }
  }

  onDateRangeChange(event: any) {
    const rangeKey = event.value;
    const dateRangeControl = this.transactionSearchForm.get('dateRange');

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
        startDate = this.transactionSearchForm.get('dateRange')!.value[0];
        endDate = this.transactionSearchForm.get('dateRange')!.value[1];

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

    this.transactionSearchForm.get('dateRange')!.setValue([startDate, endDate]);
    this.loadTransactions();
  }

  loadTransactions() {
    const [startDate, endDate] = this.transactionSearchForm.get('dateRange')?.value;

    if (!startDate || !endDate) {
      return;
    }

    this.transactionService
      .getTransactions(startDate, endDate, TransactionDateFilterType.Transaction)
      .subscribe({
        next: (transactions) => {
          const groupedMap = new Map<string, Transaction[]>();

          const sortedTransactions = [...transactions].reverse();

          for (const transaction of sortedTransactions) {
            const dateKey = new Date(transaction.transactionDate).toISOString().slice(0, 10); // 'YYYY-MM-DD'
            if (!groupedMap.has(dateKey)) {
              groupedMap.set(dateKey, []);
            }
            groupedMap.get(dateKey)!.push(transaction);
          }

          const result: GroupedTransaction[] = Array.from(groupedMap, ([date, transactions]) => ({
            date,
            transactions
          }));

          this.groupedTransactions.set(result);
          this.errorMessage.set(null);
        },
        error: (error: string) => {
          this.errorMessage.set(error);
        }
      });
  }

  getTransactionIcon(transaction: Transaction): string {
    return CommonUtils.getGroupIcon(transaction.category.group);
  }

  getTransactionAmountClass(transaction: Transaction): string {
    return transaction.type == TransactionType.Expense ? 'text-coinly-danger' : 'text-coinly-success';
  }

  getTransactionStatusSeverity(status: TransactionStatus): string {
    return status === TransactionStatus.Pending ? 'warn' : 'success';
  }

  getTransactionWalletIcon(type: WalletType): string {
    return CommonUtils.getWalletIcon(type);
  }

  isExpenseTransaction(transaction: Transaction): boolean {
    return transaction.type === TransactionType.Expense;
  }

  onTransactionSelectionChange(checked: boolean, transaction: Transaction) {
    this.selectedTransactions.update(currentTransactions => {
      if (checked) {
        return [...currentTransactions, transaction];
      } else {
        return currentTransactions.filter(t => t.transactionId !== transaction.transactionId);
      }
    });
  }

  isTransactionSelected(transaction: Transaction): boolean {
    return this.selectedTransactions().some(t => t.transactionId === transaction.transactionId);
  }

  onPayPendings() {
    if (this.selectedTransactions().length === 0) {
      return;
    }

    this.showPayTransactionDialog = true;
  }

  onPayPendingsDialogClose() {
    this.showPayTransactionDialog = false;
    this.selectedTransactions.set([]);
    this.loadTransactions();
  }
}
