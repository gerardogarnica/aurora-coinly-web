import { Wallet } from "@features/wallets/models/wallet.model";

export interface Method {
  paymentMethodId: string;
  wallet: Wallet;
  name: string;
  isDefault: boolean;
  allowRecurring: boolean;
  autoMarkAsPaid: boolean;
  maxDaysToReverse: number;
  suggestedPaymentDay?: number;
  statementCutoffDay?: number;
  isDeleted: boolean;
  notes?: string;
}

export interface CreateMethod extends Omit<Method, 'wallet' | 'paymentMethodId' | 'isDeleted'> {
  relatedWalletId: string;
}

export interface UpdateMethod extends Omit<Method, 'wallet' | 'isDefault' | 'isDeleted'> {
  relatedWalletId: string;
}