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