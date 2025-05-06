import { WalletTransactionType } from '@features/wallets/models/wallet.types';

export interface WalletTransactionModel {
  operationId: string;
  type: WalletTransactionType;
  description: string;
  amount: number;
  availableBalance: number;
  savingsBalance: number;
  date: Date;
}