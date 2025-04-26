import { WalletHistoryType } from '@features/wallets/models/wallet.types';

export interface WalletTransactionModel {
  operationId: string;
  type: WalletHistoryType;
  description: string;
  amount: number;
  availableBalance: number;
  savingsBalance: number;
  date: Date;
}