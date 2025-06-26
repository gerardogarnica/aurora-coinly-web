import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateWallet, Wallet } from '@features/wallets/models/wallet.model';
import { WalletService } from '@features/wallets/services/wallet.service';
import { ProcessStatus } from '@shared/models/process-status.model';
import { CommonUtils } from '@shared/utils/common.utils';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-new-wallet-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, ColorPickerModule, DatePickerModule, DialogModule, InputNumberModule, InputText, SelectModule, TextareaModule, ToastModule, ToggleSwitchModule],
  providers: [MessageService],
  templateUrl: './new-wallet-form.component.html'
})
export class NewWalletFormComponent {
  @Input() wallet?: Wallet;
  @Input() processStatus: ProcessStatus = 'none';
  @Input() showDialog: boolean = false;
  @Output() cancelAction = new EventEmitter<void>();

  walletService = inject(WalletService);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);

  walletCurrencies = [
    { label: 'USD (United States Dollar)', value: 'USD' },
    { label: 'EUR (Euro)', value: 'EUR' }
  ];

  walletTypes = [
    { label: 'Bank', value: 'Bank' },
    { label: 'Cash', value: 'Cash' },
    { label: 'EMoney', value: 'EMoney' }
  ];

  openedAtMinDate: Date | undefined;
  openedAtMaxDate: Date | undefined;

  walletForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    currencyCode: ['USD', [Validators.required]],
    amount: [0.00, [Validators.required, Validators.min(0), Validators.max(999999.99)]],
    type: ['', [Validators.required]],
    allowNegative: [false, [Validators.required]],
    color: ['#0000ff', [Validators.required]],
    notes: ['', Validators.maxLength(1000)],
    openedOn: [CommonUtils.currentDate(), [Validators.required]]
  });

  setOpenedAtMinMaxDates() {
    this.openedAtMaxDate = CommonUtils.currentDate();

    this.openedAtMinDate = CommonUtils.currentDate();
    this.openedAtMinDate.setFullYear(this.openedAtMinDate.getFullYear() - 1);
  }

  showDialogForm() {
    this.processStatus = 'init';
    this.setOpenedAtMinMaxDates();

    if (this.wallet) {
      this.walletForm.patchValue({
        name: this.wallet.name,
        currencyCode: this.wallet.currencyCode,
        amount: this.wallet.totalAmount,
        type: this.wallet.type,
        allowNegative: this.wallet.allowNegative,
        color: this.wallet.color,
        notes: this.wallet.notes || ''
      });
    } else {
      this.resetForm();
    }
  }

  hideDialogForm() {
    this.resetForm();
    this.processStatus = 'none';
    this.showDialog = false;

    this.cancelAction.emit();
  }

  resetForm() {
    this.walletForm.reset({
      name: '',
      currencyCode: 'USD',
      amount: 0.00,
      type: '',
      allowNegative: false,
      color: '#0000ff',
      notes: '',
      openedOn: CommonUtils.currentDate()
    });

    this.processStatus = 'init';
  }

  onSave() {
    if (!this.walletForm.valid) {
      return;
    }

    if (this.processStatus === 'loading') {
      return;
    }

    this.processStatus = 'loading';
    const formValue = this.walletForm.value;

    const newWallet: CreateWallet = {
      ...formValue,
      openedOn: formValue.openedOn.toISOString().slice(0, 10)
    };

    this.createWallet(newWallet);
  }

  createWallet(wallet: CreateWallet) {
    this.walletService
      .createWallet(wallet)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Wallet created',
            detail: `The wallet ${wallet.name} has been successfully created.`,
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error creating wallet',
            detail: error,
            life: 2000
          });
        }
      });
  }
}
