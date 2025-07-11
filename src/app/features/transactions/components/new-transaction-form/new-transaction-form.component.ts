import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Category } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';
import { Method } from '@features/methods/models/method.model';
import { MethodService } from '@features/methods/services/methods.service';
import { CreateExpenseTransaction, CreateIncomeTransaction } from '@features/transactions/models/transaction.model';
import { TransactionType } from '@features/transactions/models/transaction.types';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-new-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ConfirmDialog, DatePickerModule, DialogModule, InputNumberModule, InputText, SelectModule, TextareaModule, ToastModule, ToggleSwitchModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './new-transaction-form.component.html'
})
export class NewTransactionFormComponent {
  @Input() showDialog: boolean = false;
  @Output() cancelAction = new EventEmitter<void>();

  categoryService = inject(CategoryService);
  methodService = inject(MethodService);
  transactionService = inject(TransactionService);
  walletService = inject(WalletService);
  formBuilder = inject(FormBuilder);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  amountMax: number = 999999.99;
  processStatus: ProcessStatus = 'none';
  selectedPaymentMethod?: Method;
  transactionType?: TransactionType;
  transactionMinDate: Date = CommonUtils.currentDate();
  transactionMaxDate: Date = CommonUtils.currentDate();

  categories: Category[] = [];
  categoriesByType: Category[] = [];
  paymentMethods: Method[] = [];
  wallets: Wallet[] = [];

  transactionForm: FormGroup = this.formBuilder.group({
    categoryId: ['', [Validators.required]],
    paymentMethodId: [null],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    transactionDate: [CommonUtils.currentDate(), [Validators.required]],
    amount: [0.00, [Validators.required, Validators.min(0.01), Validators.max(this.amountMax)]],
    notes: ['', Validators.maxLength(1000)],
    makePayment: [false, [Validators.required]],
    walletId: [null]
  });

  setTransactionType(type: any) {
    if (this.transactionType === type) {
      return; // No change, do nothing
    }

    // Set the new transaction type
    this.transactionType = type;

    // Set the minimum transaction date
    this.transactionMinDate.setFullYear(this.transactionMinDate.getFullYear() - 1);

    // Patch the form values to default for the new transaction type
    this.transactionForm.patchValue({
      categoryId: '',
      paymentMethodId: null,
      makePayment: false
    });

    // Filter categories based on the selected transaction type
    var categories = this.categories.filter(category => category.type === this.transactionType);
    this.categoriesByType = categories;

    // Update the form validators and controls based on the transaction type
    const paymentMethodCtrl = this.transactionForm.get('paymentMethodId');

    if (this.transactionType === TransactionType.Expense) {
      paymentMethodCtrl?.enable();
      paymentMethodCtrl?.setValidators([Validators.required]);

      this.selectedPaymentMethod = this.paymentMethods.find(method => method.isDefault === true);
      this.setPaymentMethodChanged();
    } else {
      paymentMethodCtrl?.disable();
      paymentMethodCtrl?.clearValidators();

      this.selectedPaymentMethod = undefined;

      let walletId = this.transactionForm.get('walletId')?.value;
      this.setWalletMethodChanged(this.wallets.find(wallet => wallet.walletId === walletId)!);
    }
  }

  getCategories() {
    this.categoryService
      .getCategories(false)
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.categoriesByType = categories.filter(category => category.type === this.transactionType);
        },
        error: (error: string) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error loading categories',
            detail: error,
            life: 2000
          });
        }
      });
  }

  getPaymentMethods() {
    this.methodService
      .getMethods(false)
      .subscribe({
        next: (methods) => {
          this.paymentMethods = methods;

          // If the transaction type is Expense, we can set a default payment method if needed
          if (this.transactionType === TransactionType.Expense) {
            this.selectedPaymentMethod = this.paymentMethods.find(method => method.isDefault === true);
            this.setPaymentMethodChanged();
          }
        },
        error: (error: string) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error loading payment methods',
            detail: error,
            life: 2000
          });
        }
      });
  }

  getWallets() {
    this.walletService
      .getWallets(false)
      .subscribe({
        next: (wallets) => {
          this.wallets = wallets;

          if (this.selectedPaymentMethod) {
            this.setWalletMethodChanged(this.wallets.find(wallet => wallet.walletId === this.selectedPaymentMethod?.wallet.walletId)!);
          }
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
    this.getCategories();
    this.getPaymentMethods();
    this.getWallets();
    this.setTransactionType(TransactionType.Expense);
  }

  hideDialogForm() {
    this.resetForm();
    this.processStatus = 'none';
    this.showDialog = false;

    this.cancelAction.emit();
  }

  resetForm() {
    this.transactionForm.reset({
      categoryId: '',
      paymentMethodId: '',
      description: '',
      transactionDate: CommonUtils.currentDate(),
      amount: 0.00,
      notes: '',
      makePayment: false,
      walletId: null
    });

    this.processStatus = 'init';
    this.transactionType = undefined;
  }

  setPaymentMethodChanged() {
    if (!this.selectedPaymentMethod) {
      return; // No payment method selected, do nothing
    }

    this.setMakePaymentChanged(this.selectedPaymentMethod.autoMarkAsPaid);
  }

  setMakePaymentChanged(makePayment: boolean) {
    if (!this.selectedPaymentMethod) {
      return; // No payment method selected, do nothing
    }

    const walletCtrl = this.transactionForm.get('walletId');
    let walletId: string | null = null;

    if (makePayment) {
      walletCtrl?.enable();
      walletCtrl?.setValidators([Validators.required]);

      walletId = this.selectedPaymentMethod.wallet?.walletId || null;
    } else {
      walletCtrl?.disable();
      walletCtrl?.clearValidators();
    }

    this.transactionForm.patchValue({
      paymentMethodId: this.selectedPaymentMethod.paymentMethodId,
      makePayment: makePayment,
      walletId: walletId
    });

    this.setWalletMethodChanged(this.wallets.find(wallet => wallet.walletId === walletId)!);
  }

  setWalletMethodChanged(wallet: Wallet) {
    if (!wallet) {
      // Set the transaction date limits
      this.transactionMinDate = CommonUtils.currentDate();
      this.transactionMinDate.setFullYear(this.transactionMinDate.getFullYear() - 1);

      return; // No wallet selected, do nothing
    }

    if (this.transactionType === TransactionType.Income) {
      this.amountMax = 999999.99;
    } else {
      this.amountMax = wallet.allowNegative
        ? 999999.99
        : wallet.availableAmount || 0;
    }

    let sourceWalletMinDate = new Date(wallet.lastOperationOn);
    const nextDay = new Date(sourceWalletMinDate.setDate(sourceWalletMinDate.getDate() + 1));
    nextDay.setHours(0, 0, 0, 0);

    this.transactionMinDate = nextDay;
    if (nextDay > this.transactionForm.value.transactionDate) {
      this.transactionForm.patchValue({
        transactionDate: nextDay
      });
    }
  }

  onPaymentMethodChange(event: any) {
    let paymentMethodId = event.value;
    if (!paymentMethodId) {
      return;
    }

    this.selectedPaymentMethod = this.paymentMethods.find(method => method.paymentMethodId === paymentMethodId);
    this.setPaymentMethodChanged();
  }

  onMakePaymentChange(event: any) {
    const makePayment = event.checked;
    this.setMakePaymentChanged(makePayment);
  }

  onWalletChange(event: any) {
    let walletId = event.value;
    if (!walletId) {
      return;
    }

    this.setWalletMethodChanged(this.wallets.find(wallet => wallet.walletId === walletId)!);
  }

  onSave() {
    if (!this.transactionForm.valid) {
      return;
    }

    if (this.processStatus === 'loading') {
      return;
    }

    this.processStatus = 'loading';
    const formValue = this.transactionForm.value;

    if (this.transactionType === TransactionType.Income) {
      const transaction: CreateIncomeTransaction = {
        ...formValue,
        currencyCode: this.wallets.find(wallet => wallet.walletId === formValue.walletId)?.currencyCode || 'USD',
        transactionDate: formValue.transactionDate.toISOString().slice(0, 10)
      };

      this.createIncomeTransaction(transaction);
    } else {
      const transaction: CreateExpenseTransaction = {
        ...formValue,
        currencyCode: this.wallets.find(wallet => wallet.walletId === formValue.walletId)?.currencyCode || 'USD',
        transactionDate: formValue.transactionDate.toISOString().slice(0, 10)
      };

      this.createExpenseTransaction(transaction);
    }
  }

  createIncomeTransaction(transaction: CreateIncomeTransaction) {
    this.transactionService
      .createIncome(transaction)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Income transaction created successfully',
            detail: `The transaction ${transaction.description} has been successfully created.`,
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error creating transaction',
            detail: error,
            life: 2000
          });
        }
      });
  }

  createExpenseTransaction(transaction: CreateExpenseTransaction) {
    this.transactionService
      .createExpense(transaction)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Expense transaction created successfully',
            detail: `The transaction ${transaction.description} has been successfully created.`,
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error creating transaction',
            detail: error,
            life: 2000
          });
        }
      });
  }
}
