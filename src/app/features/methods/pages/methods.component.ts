import { Component, inject, signal } from '@angular/core';
import { faSearch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import { SetDefaultMethodComponent } from '@features/methods/components/set-default-method/set-default-method.component';
import { Method } from '@features/methods/models/method.model';
import { MethodService } from '@features/methods/services/methods.service';
import { SharedModule } from '@shared/shared.module';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { LargeButtonComponent } from '@shared/components/large-button/large-button.component';
import { ModalDialogComponent } from '@shared/components/modal-dialog/modal-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { InputFieldColorsWithIcon } from '@shared/models/control-colors.model';
import { ProcessStatus } from '@shared/models/process-status.model';

@Component({
  selector: 'app-methods',
  standalone: true,
  imports: [SetDefaultMethodComponent, SharedModule, IconButtonComponent, LargeButtonComponent, ModalDialogComponent, PageTitleComponent],
  templateUrl: './methods.component.html'
})
export default class MethodsComponent {
  private readonly methodService = inject(MethodService);

  methods = signal<Method[]>([]);
  methodFormDialogMode = signal<'add' | 'update'>('add');
  methodFormErrorMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  processStatus = signal<ProcessStatus>('init');
  selectedMethod = signal<Method | undefined>(undefined);
  setDefaultMethodErrorMessage = signal<string | null>(null);
  setSuccessMessage = signal<string | null>(null);
  showDeleted = signal(false);
  showFormDialog = signal(false);
  showDeleteDialog = signal(false);
  showSetDefaultDialog = signal(false);

  faSearch = faSearch;
  faCheck = faCheck;
  faTimes = faTimes;

  ngOnInit() {
    this.loadMethods();
  }

  get inputFieldColorsWithIcon(): string {
    return InputFieldColorsWithIcon;
  }

  loadMethods() {
    this.onDialogClose();

    this.methodService
      .getMethods(this.showDeleted())
      .subscribe({
        next: (methods: Method[]) => {
          this.methods.set(methods);
          this.errorMessage.set(null);
        },
        error: (error: string) => {
          this.errorMessage.set(error);
        }
      });
  }

  onShowDeletedToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.showDeleted.set(checked);
    this.loadMethods();
  }

  openAddMethodDialog() {
    this.selectedMethod.set(undefined);
    this.processStatus.set('init');
    this.showFormDialog.set(true);
  }

  openEditMethodDialog(method: Method) {
    this.selectedMethod.set(method);
    this.processStatus.set('init');
    this.showFormDialog.set(true);
  }

  openDeleteMethodDialog(method: Method) {
    this.selectedMethod.set(method);
    this.processStatus.set('init');
    this.showDeleteDialog.set(true);
  }

  openSetDefaultMethodDialog(method: Method) {
    this.selectedMethod.set(method);
    this.processStatus.set('init');
    this.showSetDefaultDialog.set(true);
  }

  onDialogClose(): void {
    this.showFormDialog.set(false);
    this.showDeleteDialog.set(false);
    this.showSetDefaultDialog.set(false);
  }

  onSetDefaultMethodDialogSave() {
    this.errorMessage.set(null);
    this.processStatus.set('loading');

    this.setDefaultMethod(this.selectedMethod()!.paymentMethodId);
  }

  private setDefaultMethod(methodId: string) {
    this.methodService
      .setDefaultMethod(methodId)
      .subscribe({
        next: () => {
          this.loadMethods();
          this.processStatus.set('success');
          this.setSuccessMessage.set('Default payment method set successfully');
          //this.setSuccessMessage.set('New payment method added successfully');
          //this.setSuccessMessage.set('Payment method updated successfully');
        },
        error: (error: string) => {
          this.setDefaultMethodErrorMessage.set(error);
          this.processStatus.set('error');
        }
      });
  }
}