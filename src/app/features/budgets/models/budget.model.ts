import { BudgetFrequency } from '@features/budgets/models/budget.types';
import { Category } from '@features/categories/models/category.model';

export interface Budget {
  budgetId: string;
  categoryId: string;
  category: Category;
  budgetYear: number;
  frequency: BudgetFrequency;
  periods?: BudgetPeriod[];
}

export interface BudgetPeriod {
  periodId: string;
  periodBegins: string;
  periodEnds: string;
  currencyCode?: string;
  amountLimit: number;
  spentAmount: number;
  isExceeded: boolean;
  transactions?: BudgetTransaction[];
}

export interface BudgetTransaction {
  transactionId: string;
  description?: string;
  date: string;
  amount: number;
}

export interface CreateBudget {
  categoryId: string;
  year: number;
  frequency: BudgetFrequency;
  currencyCode?: string;
  amountLimit: number;
}

export interface UpdateBudget {
  periodId: string;
  newAmountLimit: number;
}
