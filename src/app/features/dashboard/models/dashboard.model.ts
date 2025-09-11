import { Transaction } from "@features/transactions/models/transaction.model";
import { Wallet } from "@features/wallets/models/wallet.model";

export interface DashboardSummary {
    currency: string;
    totalBalance: number;
    totalIncome: SummaryCard;
    totalExpenses: SummaryCard;
    totalSavings: SummaryCard;
    monthlyTrends: MonthlyTrend[];
    expensesByCategory: CategoryExpense[];
    expensesByGroup: CategoryGroupExpense[];
    recentTransactions: Transaction[];
    upcomingPayments: Transaction[];
    wallets: Wallet[];
}

export interface SummaryCard {
    amount: number;
    percentageChange: number;
}

export interface MonthlyTrend {
    year: number;
    month: number;
    income: number;
    expenses: number;
    savings: number;
}

export interface CategoryExpense {
    category: string;
    amount: number;
}

export interface CategoryGroupExpense {
    categoryGroup: string;
    amount: number;
}