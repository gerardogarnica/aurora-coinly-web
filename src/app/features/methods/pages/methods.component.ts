import { Component, inject, signal } from '@angular/core';
import { faSearch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import { DeleteMethodFormComponent } from '@features/methods/components/delete-method-form/delete-method-form.component';
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
  imports: [DeleteMethodFormComponent, SetDefaultMethodComponent, SharedModule, IconButtonComponent, LargeButtonComponent, ModalDialogComponent, PageTitleComponent],
  templateUrl: './methods.component.html'
})
export default class MethodsComponent {
  private readonly methodService = inject(MethodService);

  methods = signal<Method[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  processStatus = signal<ProcessStatus>('init');
  selectedMethod = signal<Method | undefined>(undefined);
  showDeletedMethods = signal(false);

  showDialogForm = signal(false);
  dialogFormMode = signal<'add' | 'update' | 'delete' | 'set-default'>('add');
  dialogFormTitle = signal<string>('');
  dialogFormMessage = signal<string | null>(null);

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
      .getMethods(this.showDeletedMethods())
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
    this.showDeletedMethods.set(checked);
    this.loadMethods();
  }

  openDialogForm(mode: 'add' | 'update' | 'delete' | 'set-default', title: string, method?: Method) {
    this.dialogFormMode.set(mode);
    this.dialogFormTitle.set(title);
    this.dialogFormMessage.set(null);
    this.selectedMethod.set(method);
    this.processStatus.set('init');
    this.showDialogForm.set(true);
  }

  onDialogClose(): void {
    this.showDialogForm.set(false);
  }

  onDeleteMethodDialogSave() {
    this.errorMessage.set(null);
    this.processStatus.set('loading');

    this.deleteMethod(this.selectedMethod()!.paymentMethodId);
  }

  onSetDefaultMethodDialogSave() {
    this.errorMessage.set(null);
    this.processStatus.set('loading');

    this.setDefaultMethod(this.selectedMethod()!.paymentMethodId);
  }

  private deleteMethod(methodId: string) {
    this.methodService
      .deleteMethod(methodId)
      .subscribe({
        next: () => {
          this.loadMethods();
          this.processStatus.set('success');
          this.successMessage.set('Payment method deleted successfully');
        },
        error: (error: string) => {
          this.dialogFormMessage.set(error);
          this.processStatus.set('error');
        }
      });
  }

  private setDefaultMethod(methodId: string) {
    this.methodService
      .setDefaultMethod(methodId)
      .subscribe({
        next: () => {
          this.loadMethods();
          this.processStatus.set('success');
          this.successMessage.set('Default payment method set successfully');
          //this.successMessage.set('New payment method added successfully');
          //this.successMessage.set('Payment method updated successfully');
        },
        error: (error: string) => {
          this.dialogFormMessage.set(error);
          this.processStatus.set('error');
        }
      });
  }
}