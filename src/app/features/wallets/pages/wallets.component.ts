import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewWalletFormComponent } from '@features/wallets/components/new-wallet-form/new-wallet-form.component';
import { Wallet } from '@features/wallets/models/wallet.model';
import { WalletService } from '@features/wallets/services/wallet.service';
import { PageHeaderComponent } from '@shared/components/page-header.component';
import { PageTitleComponent } from '@shared/components/page-title.component';

import { ConfirmationService, MessageService } from 'primeng/api';
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
  imports: [CommonModule, NewWalletFormComponent, PageHeaderComponent, PageTitleComponent, ButtonModule, ConfirmDialog, IconFieldModule, InputIconModule, InputText, TableModule, TagModule, ToastModule, ToggleSwitchModule],
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

  showDialog = false;

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

  getAllowNegativeIcon(allowNegative: boolean): string {
    return allowNegative ? 'pi pi-check' : 'pi pi-times';
  }

  getAllowNegativeSeverity(allowNegative: boolean): string {
    return allowNegative ? 'success' : 'danger';
  }

  getStatusSeverity(isDeleted: boolean): string {
    return isDeleted ? 'danger' : 'success';
  }

  onAddWallet() {
    this.selectedWallet.set(undefined);
    this.showDialog = true;
  }

  onEditWallet(wallet: Wallet) {
    this.selectedWallet.set(wallet);
    this.showDialog = true;
  }

  onDeleteWallet(wallet: Wallet) {
    this.selectedWallet.set(wallet);

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + wallet.name + '?',
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
            error: (error: string) =>{
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

  onWalletFormDialogClose() {
    this.showDialog = false;
    this.loadWallets();
  }
}
