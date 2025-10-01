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

  groupedTransactions = signal<GroupedTransaction[]>([]);
  selectedTransactions = signal<Transaction[]>([]);

  showPayTransactionDialog = false;

  TransactionStatus = TransactionStatus;

  transactionSearchForm: FormGroup = this.formBuilder.group({
    date: [CommonUtils.currentDate(), [Validators.required]]
  });

  ngOnInit() {
    this.loadTransactions();
  }

  onSearch() { }

  loadTransactions() {
    const selectedDate = new Date(this.transactionSearchForm.value.date);

    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    this.transactionService
      .getTransactions(firstDayOfMonth, lastDayOfMonth, TransactionDateFilterType.Transaction)
      .subscribe({
        next: (transactions) => {
          const groupedMap = new Map<string, Transaction[]>();

          const sortedTransactions = [...transactions].sort((a, b) =>
            new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
          );

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
        },
        error: (error: string) => {
          console.error(error);
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
