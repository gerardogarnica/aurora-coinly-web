import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AssignToAvailableWalletRequest, AssignToSavingsWalletRequest, Wallet } from '@features/wallets/models/wallet.model';
import { WalletService } from '@features/wallets/services/wallet.service';
import { ProcessStatus } from '@shared/models/process-status.model';
import { CommonUtils } from '@shared/utils/common.utils';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-assign-to-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ConfirmDialog, DatePickerModule, DialogModule, InputNumberModule, ToastModule],
  providers: [ConfirmationService, CurrencyPipe, MessageService],
  templateUrl: './assign-to-form.component.html'
})
export class AssignToFormComponent {
  @Input() wallet?: Wallet;
  @Input() showDialog: boolean = false;
  @Input() assignToType: 'available' | 'savings' = 'available';
  @Output() cancelAction = new EventEmitter<void>();

  walletService = inject(WalletService);
  currencyPipe = inject(CurrencyPipe);
  formBuilder = inject(FormBuilder);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  amountMax: number = 999999.99;
  assignedOnMinDate: Date | undefined;
  assignedOnMaxDate: Date | undefined;
  processStatus: ProcessStatus = 'none';

  assignForm: FormGroup = this.formBuilder.group({
    amount: [0.00, [Validators.required, Validators.min(0.01), Validators.max(this.amountMax)]],
    assignedOn: [CommonUtils.currentDate(), [Validators.required]]
  });

  setAmountMax() {
    if (this.assignToType === 'available') {
      this.amountMax = this.wallet?.savingsAmount || 0;
    } else {
      this.amountMax = this.wallet?.allowNegative
        ? 999999.99 // No limit if negative amounts are allowed
        : this.wallet?.availableAmount || 0;
    }
  }

  setAssignedOnMinMaxDates() {
    this.assignedOnMaxDate = CommonUtils.currentDate();

    let minDate = new Date(this.wallet?.lastOperationOn || CommonUtils.currentDate());
    const nextDay = new Date(minDate.setDate(minDate.getDate() + 1));
    nextDay.setHours(0, 0, 0, 0);
    this.assignedOnMinDate = nextDay;

    this.assignForm.patchValue({
      assignedOn: this.assignedOnMaxDate
    });
  }

  getComponentTitle(): string {
    return this.assignToType === 'available' ? 'Assign To Available' : 'Assign To Savings';
  }

  getFromAmount(): number {
    return this.assignToType === 'available' ? this.wallet?.savingsAmount || 0 : this.wallet?.availableAmount || 0;
  }

  getToAmount(): number {
    return this.assignToType === 'available' ? this.wallet?.availableAmount || 0 : this.wallet?.savingsAmount || 0;
  }

  getFormattedAmount(): string {
    return CommonUtils.formatAmount(
      this.assignForm.value.amount,
      this.wallet?.currencyCode || 'USD',
      this.currencyPipe);
  }

  showDialogForm() {
    this.resetForm();
    this.setAmountMax();
    this.setAssignedOnMinMaxDates();
  }

  hideDialogForm() {
    this.resetForm();
    this.processStatus = 'none';
    this.showDialog = false;

    this.cancelAction.emit();
  }

  resetForm() {
    this.assignForm.reset({
      amount: 0.00,
      assignedOn: CommonUtils.currentDate()
    });

    this.processStatus = 'init';
    this.assignedOnMinDate = undefined;
    this.assignedOnMaxDate = undefined;
  }

  onAssign() {
    if (!this.assignForm.valid) {
      return;
    }

    if (this.processStatus === 'loading') {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to assign <b>${this.getFormattedAmount()}</b> to <b>${this.assignToType}</b>?`,
      header: 'Confirm assignment',
      icon: 'pi pi-question-circle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        icon: 'pi pi-times',
        size: 'small'
      },
      acceptButtonProps: {
        label: 'Confirm',
        severity: 'success',
        icon: 'pi pi-check',
        size: 'small'
      },
      accept: () => {
        this.processStatus = 'loading';
        const formValue = this.assignForm.value;

        if (this.assignToType === 'available') {
          const assignment: AssignToAvailableWalletRequest = {
            ...formValue,
            walletId: this.wallet?.walletId,
            assignedOn: formValue.assignedOn.toISOString().slice(0, 10)
          };

          this.assignToAvailable(assignment);
        } else {
          const assignment: AssignToSavingsWalletRequest = {
            ...formValue,
            walletId: this.wallet?.walletId,
            assignedOn: formValue.assignedOn.toISOString().slice(0, 10)
          };

          this.assignToSavings(assignment);
        }
      }
    });
  }

  assignToAvailable(assignment: AssignToAvailableWalletRequest) {
    this.walletService
      .assignToAvailableWallet(assignment)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Amount assigned',
            detail: `The amount of ${this.getFormattedAmount()} has been successfully assigned to available.`,
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error assigning amount',
            detail: error,
            life: 2000
          });
        }
      })
  }

  assignToSavings(assignment: AssignToSavingsWalletRequest) {
    this.walletService
      .assignToSavingsWallet(assignment)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Amount assigned',
            detail: `The amount of ${this.getFormattedAmount()} has been successfully assigned to savings.`,
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error assigning amount',
            detail: error,
            life: 2000
          });
        }
      })
  }
}
