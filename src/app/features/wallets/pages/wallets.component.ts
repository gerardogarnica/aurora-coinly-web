import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignToFormComponent } from '@features/wallets/components/assign-to-form/assign-to-form.component';
import { NewWalletFormComponent } from '@features/wallets/components/new-wallet-form/new-wallet-form.component';
import { TransferFundsFormComponent } from '@features/wallets/components/transfer-funds-form/transfer-funds-form.component';
import { Wallet } from '@features/wallets/models/wallet.model';
import { WalletType } from '@features/wallets/models/wallet.types';
import { WalletService } from '@features/wallets/services/wallet.service';
import { PageHeaderComponent } from '@shared/components/page-header.component';
import { PageTitleComponent } from '@shared/components/page-title.component';

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
  selector: 'app-wallets',
  standalone: true,
  imports: [CommonModule, AssignToFormComponent, NewWalletFormComponent, TransferFundsFormComponent, PageHeaderComponent, PageTitleComponent, AvatarModule, ButtonModule, ConfirmDialog, IconFieldModule, InputIconModule, InputText, TableModule, TagModule, ToastModule, ToggleSwitchModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './wallets.component.html'
})
export default class WalletsComponent {
  @ViewChild('dt') dt!: Table;

  walletService = inject(WalletService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  wallets = signal<Wallet[]>([]);
  selectedWallet = signal<Wallet | undefined>(undefined);
  showDeleted = signal(false);

  assignToType: 'available' | 'savings' = 'available';
  showAddDialog = false;
  showAssignToDialog = false;
  showTransferToDialog = false;

  ngOnInit() {
    this.loadWallets();
  }

  loadWallets() {
    this.walletService
      .getWallets(this.showDeleted())
      .subscribe({
        next: (wallets) => {
          this.wallets.set(wallets);
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

  onSearch(event: Event, dt: any) {
    const input = event.target as HTMLInputElement;
    dt.filterGlobal(input.value, 'contains');
  }

  onShowInactiveChange(event: any) {
    this.showDeleted.set(event.checked);
    this.loadWallets();
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

  onAddWallet() {
    this.selectedWallet.set(undefined);
    this.showAddDialog = true;
  }

  onTransferFunds(wallet: Wallet) {
    this.selectedWallet.set(wallet);
    this.showTransferToDialog = true;
  }

  onToSavings(wallet: Wallet) {
    this.selectedWallet.set(wallet);
    this.assignToType = 'savings';
    this.showAssignToDialog = true;
  }

  onToAvailable(wallet: Wallet) {
    this.selectedWallet.set(wallet);
    this.assignToType = 'available';
    this.showAssignToDialog = true;
  }

  onEditWallet(wallet: Wallet) {
    this.selectedWallet.set(wallet);
  }

  onDeleteWallet(wallet: Wallet) {
    this.selectedWallet.set(wallet);

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + wallet.name + '</b>?',
      header: 'Delete wallet',
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
        this.walletService
          .deleteWallet(wallet.walletId)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Wallet deleted',
                detail: `The wallet ${wallet.name} has been successfully deleted.`,
                life: 2000
              });

              this.loadWallets();
            },
            error: (error: string) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error deleting wallet',
                detail: error,
                life: 2000
              });
            }
          });
      }
    });
  }

  onAddWalletFormDialogClose() {
    this.showAddDialog = false;
    this.loadWallets();
  }

  onAssignToFormDialogClose() {
    this.showAssignToDialog = false;
    this.loadWallets();
  }

  onTransferFundsFormDialogClose() {
    this.showTransferToDialog = false;
    this.loadWallets();
  }
}
