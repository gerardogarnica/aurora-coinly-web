import { Transaction } from "@features/transactions/models/transaction.model";

export interface DashboardSummary {
    currency: string;
    totalBalance: number;
    totalIncome: SummaryCard;
    totalExpenses: SummaryCard;
    totalSavings: SummaryCard;
    monthlyTrends: MonthlyTrend[];
    expensesByCategory: CategoryExpense[];
    recentTransactions: Transaction[];
    upcomingPayments: Transaction[];
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