import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateMethod, Method, UpdateMethod } from '@features/methods/models/method.model';
import { MethodService } from '@features/methods/services/methods.service';
import { Wallet } from '@features/wallets/models/wallet.model';
import { WalletService } from '@features/wallets/services/wallet.service';
import { ProcessStatus } from '@shared/models/process-status.model';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-method-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputNumberModule, InputText, SelectModule, TextareaModule, ToastModule, ToggleSwitchModule],
  providers: [MessageService],
  templateUrl: './method-form.component.html'
})
export class MethodFormComponent {
  @Input() method?: Method;
  @Input() processStatus: ProcessStatus = 'none';
  @Input() showDialog: boolean = false;
  @Output() cancelAction = new EventEmitter<void>();

  methodService = inject(MethodService);
  walletService = inject(WalletService);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);

  wallets: Wallet[] = [];

  methodForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    relatedWalletId: ['', [Validators.required]],
    maxDaysToReverse: [15, [Validators.required, Validators.min(0), Validators.max(15)]],
    autoMarkAsPaid: [true, [Validators.required]],
    allowRecurring: [false, [Validators.required]],
    isDefault: [false, [Validators.required]],
    suggestedPaymentDay: [null, [Validators.min(1), Validators.max(31)]],
    statementCutoffDay: [null, [Validators.min(1), Validators.max(31)]],
    notes: ['', Validators.maxLength(1000)]
  });

  getComponentTitle(): string {
    return this.method ? 'Edit Payment Method' : 'Add New Payment Method';
  }

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
    this.processStatus = 'init';
    this.getWallets();

    if (this.method) {
      this.methodForm.get('isDefault')?.disable();
      this.onEnableSuggestedPaymentDay(!this.method.autoMarkAsPaid);
      this.onEnableStatementCutoffDay(!this.method.autoMarkAsPaid);

      this.methodForm.patchValue({
        name: this.method.name,
        relatedWalletId: this.method.wallet.walletId,
        maxDaysToReverse: this.method.maxDaysToReverse,
        autoMarkAsPaid: this.method.autoMarkAsPaid,
        allowRecurring: this.method.allowRecurring,
        isDefault: this.method.isDefault,
        suggestedPaymentDay: this.method.suggestedPaymentDay ?? null,
        statementCutoffDay: this.method.statementCutoffDay ?? null,
        notes: this.method.notes
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
    this.methodForm.reset();
    this.methodForm.patchValue({
      name: '',
      relatedWalletId: '',
      maxDaysToReverse: 15,
      autoMarkAsPaid: true,
      allowRecurring: false,
      isDefault: false,
      suggestedPaymentDay: null,
      statementCutoffDay: null,
      notes: ''
    });

    this.methodForm.get('isDefault')?.enable();
    this.onEnableSuggestedPaymentDay(false);
    this.onEnableStatementCutoffDay(false);

    this.processStatus = 'init';
  }

  onChangeAutomarkAsPaid(event: any) {
    if (event.checked) {
      this.onEnableSuggestedPaymentDay(false);
      this.onEnableStatementCutoffDay(false);
    } else {
      this.onEnableSuggestedPaymentDay(true);
      this.onEnableStatementCutoffDay(true);
    }
  }

  onEnableSuggestedPaymentDay(enable: boolean) {
    const paymentDayCtrl = this.methodForm.get('suggestedPaymentDay');

    if (enable) {
      paymentDayCtrl?.enable();
      paymentDayCtrl?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);

      this.methodForm.patchValue({ suggestedPaymentDay: 1 });
    } else {
      paymentDayCtrl?.disable();
      paymentDayCtrl?.clearValidators();

      this.methodForm.patchValue({ suggestedPaymentDay: null });
    }

    paymentDayCtrl?.updateValueAndValidity();
  }

  onEnableStatementCutoffDay(enable: boolean) {
    const cutoffDayCtrl = this.methodForm.get('statementCutoffDay');

    if (enable) {
      cutoffDayCtrl?.enable();
      cutoffDayCtrl?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);

      this.methodForm.patchValue({ statementCutoffDay: 1 });
    } else {
      cutoffDayCtrl?.disable();
      cutoffDayCtrl?.clearValidators();

      this.methodForm.patchValue({ statementCutoffDay: null });
    }
  }

  onSave() {
    if (this.methodForm.valid && this.processStatus !== 'loading') {
      this.processStatus = 'loading';
      const formValue = this.methodForm.value;

      if (this.method) {
        const updateMethod: UpdateMethod = {
          ...formValue,
          paymentMethodId: this.method.paymentMethodId
        };

        this.updateMethod(updateMethod);
      } else {
        const newMethod: CreateMethod = {
          ...formValue
        };

        this.createMethod(newMethod);
      }
    }
  }

  createMethod(paymentMethod: CreateMethod) {
    this.methodService
      .createMethod(paymentMethod)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Payment method created',
            detail: `The payment method ${paymentMethod.name} has been successfully created.`,
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error creating payment method',
            detail: error,
            life: 2000
          });
        }
      });
  }

  updateMethod(paymentMethod: UpdateMethod) {
    this.methodService
      .updateMethod(paymentMethod)
      .subscribe({
        next: () => {
          this.processStatus = 'success';

          this.messageService.add({
            severity: 'success',
            summary: 'Payment method updated',
            detail: `The payment method ${paymentMethod.name} has been successfully updated.`,
            life: 2000
          });

          this.hideDialogForm();
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.messageService.add({
            severity: 'error',
            summary: 'Error updating payment method',
            detail: error,
            life: 2000
          });
        }
      });
  }
}
