import { WalletType } from '@features/wallets/models/wallet.types';
import { WalletTransactionModel } from '@features/wallets/models/wallet-transaction.model';

export interface Wallet {
  walletId: string;
  name: string;
  currencyCode: string;
  availableAmount: number;
  savingsAmount: number;
  totalAmount: number;
  type: WalletType;
  isDeleted: boolean;
  notes?: string;
  transactions?: WalletTransactionModel[];
}

export interface CreateWallet {
  name: string;
  currencyCode: string;
  amount: number;
  type: WalletType;
  notes?: string;
  openedOn: Date;
}

export interface UpdateWallet {
  walletId: string;
  name: string;
  notes?: string;
}

export interface AssignToAvailableWalletRequest {
  walletId: string;
  amount: number;
  assignedOn: Date;
}

export interface AssignToSavingsWalletRequest {
  walletId: string;
  amount: number;
  assignedOn: Date;
}

export interface TransferBetweenWalletsRequest {
  sourceWalletId: string;
  destinationWalletId: string;
  amount: number;
  transferedOn: Date;
}