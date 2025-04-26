import { TransactionType } from '@features/transactions/models/transaction.types';

export interface Category {
  categoryId: string;
  name: string;
  type: TransactionType;
  isDeleted: boolean;
  notes?: string;
}