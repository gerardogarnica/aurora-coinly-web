import { Component, inject, signal } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { NewWalletFormComponent } from '@features/wallets/components/new-wallet-form/new-wallet-form.component';
import { Wallet, CreateWallet, UpdateWallet, AssignToAvailableWalletRequest, AssignToSavingsWalletRequest, TransferBetweenWalletsRequest } from '@features/wallets/models/wallet.model';
import { WalletService } from '@features/wallets/services/wallet.service';
import { SharedModule } from '@shared/shared.module';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { LargeButtonComponent } from '@shared/components/large-button/large-button.component';
import { ModalDialogComponent } from '@shared/components/modal-dialog/modal-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { InputFieldColorsWithIcon } from '@shared/models/control-colors.model';
import { ProcessStatus } from '@shared/models/process-status.model';

@Component({
  selector: 'app-wallets',
  standalone: true,
  imports: [SharedModule, NewWalletFormComponent, IconButtonComponent, LargeButtonComponent, ModalDialogComponent, PageTitleComponent],
  templateUrl: './wallets.component.html'
})
export default class WalletsComponent {
  private readonly walletService = inject(WalletService);

  wallets = signal<Wallet[]>([]);
  walletFormDialogMode = signal<'add' | 'update'>('add');
  walletFormErrorMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  processStatus = signal<ProcessStatus>('init');
  selectedWallet = signal<Wallet | undefined>(undefined);
  showEditWalletDialog = signal(false);
  showNewWalletDialog = signal(false);
  showDeleted = signal(false);

  faSearch = faSearch;

  ngOnInit() {
    this.loadWallets();
  }

  get inputFieldColorsWithIcon(): string {
    return InputFieldColorsWithIcon;
  }

  loadWallets() {
    this.onDialogClose();

    this.walletService
      .getWallets(this.showDeleted())
      .subscribe({
        next: (wallets: Wallet[]) => {
          this.wallets.set(wallets);
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
    this.loadWallets();
  }

  openAddWalletDialog(): void {
    this.walletFormDialogMode.set('add');
    this.walletFormErrorMessage.set(null);
    this.processStatus.set('init');
    this.selectedWallet.set(undefined);
    this.showNewWalletDialog.set(true);
  }

  openEditWalletDialog(wallet: Wallet): void {
    this.walletFormDialogMode.set('update');
    this.walletFormErrorMessage.set(null);
    this.processStatus.set('init');
    this.selectedWallet.set(wallet);
    this.showEditWalletDialog.set(true);
  }

  onDialogClose(): void {
    this.showNewWalletDialog.set(false);
    this.showEditWalletDialog.set(false);
  }

  onDialogSave(walletData: CreateWallet | UpdateWallet): void {
    this.errorMessage.set(null);
    this.processStatus.set('loading');

    if(this.walletFormDialogMode() === 'add') {
      this.createWallet(walletData as CreateWallet);
    } else {
      const updateData: UpdateWallet = {
        ...walletData,
        walletId: this.selectedWallet()!.walletId
      };
      this.updateWallet(updateData);
    }
  }

  private createWallet(wallet: CreateWallet): void {
    wallet.amount = parseFloat(wallet.amount.toString().replace(',', ''));

    this.walletService
      .createWallet(wallet)
      .subscribe({
        next: () => {
          this.loadWallets();
          this.processStatus.set('success');
        },
        error: (error: string) => {
          this.walletFormErrorMessage.set(error);
          this.processStatus.set('error');
        }
      });
  }

  private updateWallet(wallet: UpdateWallet): void {
    this.walletService
      .updateWallet(wallet)
      .subscribe({
        next: () => {
          this.loadWallets();
          this.processStatus.set('success');
        },
        error: (error: string) => {
          this.walletFormErrorMessage.set(error);
          this.processStatus.set('error');
        }
      });
  }
}
