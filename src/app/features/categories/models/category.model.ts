import { TransactionType } from '@features/transactions/models/transaction.types';

export interface Category {
  categoryId: string;
  name: string;
  type: TransactionType;
  maxDaysToReverse: number;
  color: string;
  isDeleted: boolean;
  notes?: string;
}

export interface CreateCategory extends Omit<Category, 'categoryId' | 'isDeleted'> {
}

export interface UpdateCategory extends Omit<Category, 'type' | 'isDeleted'> {
}