import { Component, inject, signal, ViewChild } from '@angular/core';

import { MethodFormComponent } from '@features/methods/components/method-form.component';
import { Method } from '@features/methods/models/method.model';
import { MethodService } from '@features/methods/services/methods.service';
import { WalletType } from '@features/wallets/models/wallet.types';
import { PageHeaderComponent } from '@shared/components/page-header.component';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-methods',
  standalone: true,
  imports: [MethodFormComponent, PageHeaderComponent, AvatarModule, ButtonModule, ConfirmDialog, IconFieldModule, InputIconModule, InputText, TableModule, TagModule, ToastModule, ToggleSwitchModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './methods.component.html'
})
export default class MethodsComponent {
  @ViewChild('dt') dt!: Table;

  methodService = inject(MethodService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  methods = signal<Method[]>([]);
  errorMessage = signal<string | null>(null);
  selectedMethod = signal<Method | undefined>(undefined);
  showDeleted = signal(false);

  showDialog = false;

  ngOnInit() {
    this.loadMethods();
  }

  loadMethods() {
    this.methodService
      .getMethods(this.showDeleted())
      .subscribe({
        next: (methods) => {
          this.methods.set(methods);
          this.errorMessage.set(null);
        },
        error: (error: string) => {
          this.errorMessage.set(error);
        }
      });
  }

  onSearch(event: Event, dt: any) {
    const input = event.target as HTMLInputElement;
    dt.filterGlobal(input.value, 'contains');
  }

  onShowInactiveChange(event: any) {
    this.showDeleted.set(event.checked);
    this.loadMethods();
  }

  getTypeIcon(type: WalletType): string {
    switch (type) {
      case WalletType.Bank:
        return 'pi pi-building-columns';
      case WalletType.Cash:
        return 'pi pi-money-bill';
      case WalletType.EMoney:
        return 'pi pi-credit-card';
      default:
        return 'pi pi-wallet';
    }
  }

  getTagIcon(isSuccess: boolean): string {
    return isSuccess ? 'pi pi-check' : 'pi pi-times';
  }

  getTagSeverity(isSuccess: boolean): string {
    return isSuccess ? 'success' : 'danger';
  }

  onAddMethod() {
    this.selectedMethod.set(undefined);
    this.showDialog = true;
  }

  onEditMethod(paymentMethod: Method) {
    this.selectedMethod.set(paymentMethod);
    this.showDialog = true;
  }

  onDeleteMethod(paymentMethod: Method) {
    this.selectedMethod.set(paymentMethod);

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + paymentMethod.name + '</b>?',
      header: 'Delete payment method',
      icon: 'pi pi-question-circle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        icon: 'pi pi-times',
        size: 'small'
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
        icon: 'pi pi-trash',
        size: 'small'
      },
      accept: () => {
        this.methodService
          .deleteMethod(paymentMethod.paymentMethodId)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Payment method deleted',
                detail: `The payment method ${paymentMethod.name} has been successfully deleted.`,
                life: 2000
              });

              this.loadMethods();
            },
            error: (error: string) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error deleting payment method',
                detail: error,
                life: 2000
              });
            }
          });
      }
    });
  }

  onSetDefaultMethod(paymentMethod: Method) {
    this.selectedMethod.set(paymentMethod);

    this.confirmationService.confirm({
      message: 'Are you sure you want to set <b>' + paymentMethod.name + '</b> as default payment method?',
      header: 'Set default payment method',
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
        this.methodService
          .setDefaultMethod(paymentMethod.paymentMethodId)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Default payment method set',
                detail: `The payment method ${paymentMethod.name} has been set as default.`,
                life: 2000
              });

              this.loadMethods();
            },
            error: (error: string) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error setting default payment method',
                detail: error,
                life: 2000
              });
            }
          });
      }
    });
  }

  onMethodFormDialogClose() {
    this.showDialog = false;
    this.loadMethods();
  }
}
