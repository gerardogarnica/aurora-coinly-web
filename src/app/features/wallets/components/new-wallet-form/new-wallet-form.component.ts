import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

import { CreateWallet } from '@features/wallets/models/wallet.model';
import { LargeButtonComponent } from '@shared/components/large-button/large-button.component';
import { AutofocusDirective } from '@shared/directives/autofocus.directive';
import { InputFieldColors, SelectFieldColors } from '@shared/models/control-colors.model';
import { ProcessStatus } from '@shared/models/process-status.model';

@Component({
  selector: 'app-new-wallet-form',
  standalone: true,
  imports: [ReactiveFormsModule, LargeButtonComponent, AutofocusDirective],
  templateUrl: './new-wallet-form.component.html'
})
export class NewWalletFormComponent {
  @Input() processStatus: ProcessStatus = 'init';
  @Input() submitError: string | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateWallet>();

  formBuilder = inject(FormBuilder);

  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private notFutureDateValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const selectedDate = control.value;
      const today = this.getCurrentDate();

      if (selectedDate > today) {
        return { futureDate: true };
      }
      return null;
    };
  }

  onAmountBlur() {
    const num = parseFloat(this.walletForm.get('amount')?.value);
    if (!isNaN(num)) {
      const formatted = this.formatNumber(num.toFixed(2));
      this.walletForm.get('amount')?.setValue(formatted, { emitEvent: false });
    } else {
      this.walletForm.get('amount')?.setValue(0.00, { emitEvent: false });
    }
  }

  onAmountFocus() {
    const raw = this.walletForm.get('amount')?.value.toString().replace(/,/g, '');
    this.walletForm.get('amount')?.setValue(raw, { emitEvent: false });
  }

  private formatNumber(value: string): string {
    let num = parseFloat(value);
    if (isNaN(num)) return '0.00';

    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    });
  }

  walletForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    currencyCode: ['USD', [Validators.required]],
    amount: [0.00, [Validators.required, Validators.min(0), Validators.max(999999.99)]],
    type: ['', [Validators.required]],
    notes: ['', Validators.maxLength(1000)],
    openedOn: [this.getCurrentDate(), [Validators.required, this.notFutureDateValidator()]]
  });

  get inputFieldColors(): string {
    return InputFieldColors;
  }

  get selectFieldColors(): string {
    return SelectFieldColors;
  }

  onCancel() {
    if (this.processStatus !== 'loading') {
      this.cancel.emit();
    }
  }

  onSave() {
    if (this.walletForm.valid && this.processStatus !== 'loading') {
      this.processStatus = 'loading';
      const formValue = this.walletForm.value;
      this.save.emit(formValue as CreateWallet);
    }
  }
}
