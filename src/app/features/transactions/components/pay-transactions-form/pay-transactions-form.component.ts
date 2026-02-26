import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PayPendingTransactions, Transaction } from '@features/transactions/models/transaction.model';
import { TransactionService } from '@features/transactions/services/transaction.service';
import { Wallet } from '@features/wallets/models/wallet.model';
import { WalletService } from '@features/wallets/services/wallet.service';
import { ProcessStatus } from '@shared/models/process-status.model';
import { CommonUtils } from '@shared/utils/common.utils';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pay-transactions-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ConfirmDialog, DatePickerModule, DialogModule, SelectModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './pay-transactions-form.component.html'
})
export class PayTransactionsFormComponent {
  @Input() showDialog: boolean = false;
  @Input() selectedTransactions: Transaction[] = [];
  @Output() cancelAction = new EventEmitter<void>();

  transactionService = inject(TransactionService);
  walletService = inject(WalletService);
  formBuilder = inject(FormBuilder);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  processStatus: ProcessStatus = 'none';
  paymentDateMinValue: Date = CommonUtils.currentDate();
  paymentDateMaxValue: Date = CommonUtils.currentDate();

  wallets: Wallet[] = [];

  payTransactionForm: FormGroup = this.formBuilder.group({
    walletId: [null],
    paymentDate: [CommonUtils.currentDate(), [Validators.required]]
  });

  getWallets() {
    this.walletService
      .getWallets(false)
      .subscribe({
        next: (wallets) => {
          this.wallets = wallets;
        },
        error: (error: string) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error loading wallets',
            detail: error,
            life: 2000
          });
        }
      });
  }

  showDialogForm() {
    this.resetForm();
    this.getWallets();

    console.log('Transacciones seleccionadas en el diálogo:', this.selectedTransactions);
  }

  hideDialogForm() {
    this.resetForm();
    this.processStatus = 'none';
    this.showDialog = false;

    this.cancelAction.emit();
  }

  resetForm() {
    this.payTransactionForm.reset({
      walletId: null,
      paymentDate: CommonUtils.currentDate()
    });
  }

  onWalletChange(event: any) {
    const selectedWalletId = event.value;
    if (!selectedWalletId) {
      return;
    }

    this.setWalletMethodChanged(this.wallets.find(wallet => wallet.walletId === selectedWalletId)!);
  }

  setWalletMethodChanged(wallet: Wallet) {
    this.payTransactionForm.patchValue({
      walletId: wallet.walletId
    });

    let sourceWalletMinDate = new Date(wallet.lastOperationOn);
    const nextDay = new Date(sourceWalletMinDate.setDate(sourceWalletMinDate.getDate() + 1));
    nextDay.setHours(0, 0, 0, 0);

    this.paymentDateMinValue = nextDay;
    if (nextDay > this.payTransactionForm.value.paymentDate) {
      this.payTransactionForm.patchValue({
        paymentDate: nextDay
      });
    }
  }

  onPay() {
    if (!this.payTransactionForm.valid) {
      return;
    }

    if (this.processStatus === 'loading') {
      return;
    }

    this.processStatus = 'loading';
    const formValue = this.payTransactionForm.value;

    const payPendingTransactions: PayPendingTransactions = {
      transactionIds: this.selectedTransactions.map(t => t.transactionId),
      walletId: formValue.walletId,
      paymentDate: formValue.paymentDate.toISOString().slice(0, 10)
    };

    console.log(payPendingTransactions);
    this.payPendingTransactions(payPendingTransactions);
  }

  payPendingTransactions(payPendingTransactions: PayPendingTransactions) {
    this.transactionService
      .payPendingTransactions(payPendingTransactions)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Transactions paid successfully',
            detail: 'The selected transactions have been successfully paid.',
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error paying transactions',
            detail: error,
            life: 2000
          });
        }
      });
  }

  get totalAmount(): number {
    if (!this.selectedTransactions) {
      return 0;
    }
    return this.selectedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }
}
