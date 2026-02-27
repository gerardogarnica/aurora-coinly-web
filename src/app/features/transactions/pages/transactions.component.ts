import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TransactionNotificationService } from '@core/services/transaction-notification.service';
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
import { RadioButtonModule } from 'primeng/radiobutton';
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
  imports: [PayTransactionsFormComponent, CommonModule, FormsModule, ReactiveFormsModule, PageHeaderComponent, AvatarModule, ButtonModule, CheckboxModule, ConfirmDialog, DatePicker, RadioButtonModule, SelectModule, TagModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './transactions.component.html'
})
export default class TransactionsComponent {
  transactionNotificationService = inject(TransactionNotificationService);
  transactionService = inject(TransactionService);
  formBuilder = inject(FormBuilder);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  destroyRef = inject(DestroyRef);

  errorMessage = signal<string | null>(null);
  groupedTransactions = signal<GroupedTransaction[]>([]);
  filteredGroupedTransactions = signal<GroupedTransaction[]>([]);
  selectedTransactions = signal<Transaction[]>([]);
  paymentMethodOptions = signal<{ label: string; value: string }[]>([]);
  categoryOptions = signal<{ label: string; value: string }[]>([]);

  dateRangeOptions: any[] = [
    { label: 'This month', value: 'thisMonth' },
    { label: 'Past month', value: 'pastMonth' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'Last 90 days', value: 'last90days' },
    { label: 'Custom', value: 'custom' }
  ];
  statusOptions: any[] = [
    { name: 'All', key: 'all' },
    { name: 'Only paids', key: 'paid' },
    { name: 'Only pendings', key: 'pending' }
  ];
  showPayTransactionDialog = false;

  TransactionStatus = TransactionStatus;

  transactionSearchForm: FormGroup = this.formBuilder.group({
    rangeKey: ['thisMonth', Validators.required],
    dateRange: [{ value: [], disabled: true }, Validators.required],
    selectedStatus: ['all', Validators.required],
    paymentMethodId: [null],
    categoryId: [null]
  });

  ngOnInit() {
    this.transactionNotificationService.transactionCreated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadTransactions());

    this.transactionSearchForm.get('selectedStatus')!.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.transactionSearchForm.get('paymentMethodId')!.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.transactionSearchForm.get('categoryId')!.valueChanges.subscribe(() => {
      this.applyFilters();
    });

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

          const result: GroupedTransaction[] = Array.from(groupedMap, ([date, transactions]) => ({ date, transactions }));

          this.selectedTransactions.set([]);
          this.groupedTransactions.set(result);
          this.populatePaymentMethodOptions();
          this.populateCategoryOptions();
          this.applyFilters();

          this.errorMessage.set(null);
        },
        error: (error: string) => {
          this.errorMessage.set(error);
        }
      });
  }

  populatePaymentMethodOptions() {
    const allTransactions = this.groupedTransactions().flatMap(g => g.transactions);
    const uniquePaymentMethods = new Map<string, { name: string }>();

    allTransactions.forEach(t => {
      if (t.paymentMethod && !uniquePaymentMethods.has(t.paymentMethod.paymentMethodId)) {
        uniquePaymentMethods.set(t.paymentMethod.paymentMethodId, { name: t.paymentMethod.name });
      }
    });

    const options = Array.from(uniquePaymentMethods.entries())
      .map(([id, { name }]) => ({ label: name, value: id }))
      .sort((a, b) => a.label.localeCompare(b.label));

    this.paymentMethodOptions.set(options);
  }

  populateCategoryOptions() {
    const allTransactions = this.groupedTransactions().flatMap(g => g.transactions);
    const uniqueCategories = new Map<string, { name: string }>();

    allTransactions.forEach(t => {
      if (t.category && !uniqueCategories.has(t.category.categoryId)) {
        uniqueCategories.set(t.category.categoryId, { name: t.category.name });
      }
    });

    const options = Array.from(uniqueCategories.entries())
      .map(([id, { name }]) => ({ label: name, value: id }))
      .sort((a, b) => a.label.localeCompare(b.label));

    this.categoryOptions.set(options);
  }

  applyFilters() {
    const statusToFilter = this.transactionSearchForm.get('selectedStatus')?.value;
    const paymentMethodIdToFilter = this.transactionSearchForm.get('paymentMethodId')?.value;
    const categoryIdToFilter = this.transactionSearchForm.get('categoryId')?.value;
    const originalGroups = this.groupedTransactions();

    if (statusToFilter === 'all' && !paymentMethodIdToFilter && !categoryIdToFilter) {
      this.filteredGroupedTransactions.set(originalGroups);
      return;
    }

    const filteredResult: GroupedTransaction[] = [];

    for (const group of originalGroups) {
      const filteredTransactions = group.transactions.filter(t => {
        const statusMatch = statusToFilter === 'all' || t.status.toLowerCase() === statusToFilter;
        const paymentMethodMatch = !paymentMethodIdToFilter || t.paymentMethod?.paymentMethodId === paymentMethodIdToFilter;
        const categoryMatch = !categoryIdToFilter || t.category?.categoryId === categoryIdToFilter;

        return statusMatch && paymentMethodMatch && categoryMatch;
      });

      if (filteredTransactions.length > 0) {
        filteredResult.push({
          date: group.date,
          transactions: filteredTransactions
        });
      }
    }

    this.filteredGroupedTransactions.set(filteredResult);
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
