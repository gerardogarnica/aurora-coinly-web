import { TransactionType } from '@features/transactions/models/transaction.types';

export interface Category {
  categoryId: string;
  name: string;
  type: TransactionType;
  maxDaysToReverse: number;
  color: string;
  group: CategoryGroup;
  isDeleted: boolean;
  notes?: string;
}

export interface CreateCategory extends Omit<Category, 'categoryId' | 'isDeleted'> {
}

export interface UpdateCategory extends Omit<Category, 'type' | 'isDeleted'> {
}

export enum CategoryGroup {
  Clothing = 'Clothing',
  Education = 'Education',
  Entertainment = 'Entertainment',
  Finances = 'Finances',
  FoodAndDining = 'FoodAndDining',
  Groceries = 'Groceries',
  Health = 'Health',
  Housing = 'Housing',
  Income = 'Income',
  Insurance = 'Insurance',
  Miscellaneous = 'Miscellaneous',
  Other = 'Other',
  PersonalCare = 'PersonalCare',
  Pets = 'Pets',
  Savings = 'Savings',
  Subscriptions = 'Subscriptions',
  Transportation = 'Transportation',
  Travel = 'Travel',
  Utilities = 'Utilities',
  Vehicle = 'Vehicle'
}