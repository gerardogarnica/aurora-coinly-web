import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Wallet, UpdateWallet } from '@features/wallets/models/wallet.model';
import { WalletService } from '@features/wallets/services/wallet.service';
import { ProcessStatus } from '@shared/models/process-status.model';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-edit-wallet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ColorPickerModule, DialogModule, InputText, TextareaModule, ToastModule, ToggleSwitchModule],
  providers: [MessageService],
  templateUrl: './edit-wallet-form.component.html'
})
export class EditWalletFormComponent {
  @Input() wallet: Wallet | undefined;
  @Input() processStatus: ProcessStatus = 'none';
  @Input() showDialog: boolean = false;
  @Output() cancelAction = new EventEmitter<void>();

  walletService = inject(WalletService);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);

  walletForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    allowNegative: [false, [Validators.required]],
    color: ['#0000ff', [Validators.required]],
    notes: ['', Validators.maxLength(1000)]
  });

  showDialogForm() {
    this.processStatus = 'init';

    if (this.wallet) {
      this.walletForm.patchValue({
        name: this.wallet.name,
        allowNegative: this.wallet.allowNegative,
        color: this.wallet.color,
        notes: this.wallet.notes || ''
      });
    }
  }

  hideDialogForm() {
    this.walletForm.reset({
      name: '',
      allowNegative: false,
      color: '#0000ff',
      notes: ''
    });
    this.processStatus = 'none';
    this.showDialog = false;
    this.cancelAction.emit();
  }

  onSave() {
    if (!this.walletForm.valid || !this.wallet) {
      return;
    }

    if (this.processStatus === 'loading') {
      return;
    }

    this.processStatus = 'loading';
    const formValue = this.walletForm.value;

    const updateWallet: UpdateWallet = {
      walletId: this.wallet.walletId,
      name: formValue.name,
      allowNegative: formValue.allowNegative,
      color: formValue.color,
      notes: formValue.notes
    };

    this.walletService.updateWallet(updateWallet).subscribe({
      next: () => {
        this.processStatus = 'success';

        this.messageService.add({
          severity: 'success',
          summary: 'Wallet updated',
          detail: `The wallet ${updateWallet.name} has been successfully updated.`,
          life: 2000
        });

        setTimeout(() => this.hideDialogForm(), 2000);
      },
      error: (error: string) => {
        this.processStatus = 'error';

        this.messageService.add({
          severity: 'error',
          summary: 'Error updating wallet',
          detail: error,
          life: 2000
        });
      }
    });
  }
}
