import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TransferBetweenWalletsRequest, Wallet } from '@features/wallets/models/wallet.model';
import { WalletService } from '@features/wallets/services/wallet.service';
import { ProcessStatus } from '@shared/models/process-status.model';
import { CommonUtils } from '@shared/utils/common.utils';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-transfer-funds-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ConfirmDialog, DatePickerModule, DialogModule, InputNumberModule, SelectModule, ToastModule],
  providers: [ConfirmationService, CurrencyPipe, MessageService],
  templateUrl: './transfer-funds-form.component.html'
})
export class TransferFundsFormComponent {
  @Input() wallet?: Wallet;
  @Input() showDialog: boolean = false;
  @Output() cancelAction = new EventEmitter<void>();

  walletService = inject(WalletService);
  currencyPipe = inject(CurrencyPipe);
  formBuilder = inject(FormBuilder);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  amountMax: number = 999999.99;
  processStatus: ProcessStatus = 'none';
  selectedDestinationWallet?: Wallet;
  transferedOnMinDate: Date | undefined;
  transferedOnMaxDate: Date | undefined;

  destinationWallets: Wallet[] = [];

  transferForm: FormGroup = this.formBuilder.group({
    destinationWalletId: ['', [Validators.required]],
    amount: [0.00, [Validators.required, Validators.min(0.01), Validators.max(this.amountMax)]],
    transferedOn: [CommonUtils.currentDate(), [Validators.required]]
  });

  setAmountMax() {
    this.amountMax = this.wallet?.allowNegative
      ? 999999.99 // No limit if negative amounts are allowed
      : this.wallet?.availableAmount || 0;
  }

  setTransferedOnMinMaxDates() {
    this.transferedOnMaxDate = CommonUtils.currentDate();

    let sourceWalletMinDate = new Date(this.wallet?.lastOperationOn || CommonUtils.currentDate());
    const nextDay = new Date(sourceWalletMinDate.setDate(sourceWalletMinDate.getDate() + 1));
    nextDay.setHours(0, 0, 0, 0);

    this.transferedOnMinDate = nextDay;

    if (this.selectedDestinationWallet) {
      let destinationWalletMinDate = new Date(this.selectedDestinationWallet.lastOperationOn || CommonUtils.currentDate());
      const destinationWalletNextDay = new Date(destinationWalletMinDate.setDate(destinationWalletMinDate.getDate() + 1));
      destinationWalletNextDay.setHours(0, 0, 0, 0);

      if (destinationWalletNextDay > sourceWalletMinDate) {
        this.transferedOnMinDate = destinationWalletNextDay;
      }
    }

    this.transferForm.patchValue({
      transferedOn: this.transferedOnMaxDate
    });
  }

  getWallets() {
    this.walletService
      .getWallets(false)
      .subscribe({
        next: (wallets) => {
          wallets = wallets.filter(w => w.walletId !== this.wallet?.walletId);
          this.destinationWallets = wallets;
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

  getFormattedAmount(): string {
    return CommonUtils.formatAmount(
      this.transferForm.value.amount,
      this.wallet?.currencyCode || 'USD',
      this.currencyPipe);
  }

  showDialogForm() {
    this.resetForm();
    this.getWallets();
    this.setAmountMax();
    this.setTransferedOnMinMaxDates();
  }

  hideDialogForm() {
    this.resetForm();
    this.processStatus = 'none';
    this.showDialog = false;

    this.cancelAction.emit();
  }

  resetForm() {
    this.transferForm.reset({
      destinationWalletId: '',
      amount: 0.00,
      transferedOn: CommonUtils.currentDate()
    });

    this.processStatus = 'init';
    this.selectedDestinationWallet = undefined;
    this.transferedOnMinDate = undefined;
    this.transferedOnMaxDate = undefined;
  }

  setDestinationWallet() {
    const selectedWalletId = this.transferForm.value.destinationWalletId;
    this.selectedDestinationWallet = this.destinationWallets.find(wallet => wallet.walletId === selectedWalletId);
  }

  onDestinationWalletChange() {
    this.setDestinationWallet();
    this.setTransferedOnMinMaxDates();
  }

  onTransfer() {
    if (!this.transferForm.valid) {
      return;
    }

    if (this.processStatus === 'loading') {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to transfer <b>${this.getFormattedAmount()}</b> to <b>${this.selectedDestinationWallet?.name}</b> wallet?`,
      header: 'Confirm transfer',
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
        const formValue = this.transferForm.value;

        const transfer: TransferBetweenWalletsRequest = {
          ...formValue,
          sourceWalletId: this.wallet?.walletId,
          transferedOn: formValue.transferedOn.toISOString().slice(0, 10)
        };

        this.transferFunds(transfer);
      }
    });
  }

  transferFunds(transfer: TransferBetweenWalletsRequest) {
    this.walletService
      .transferBetweenWallets(transfer)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Transfer successful',
            detail: `The amount of ${this.getFormattedAmount()} has been successfully transferred to ${this.selectedDestinationWallet?.name} wallet.`,
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error transferring funds',
            detail: error,
            life: 2000
          });
        }
      });
  }
}
