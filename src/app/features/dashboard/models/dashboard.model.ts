import { CategoryGroup } from "@features/categories/models/category.model";
import { TransactionStatus, TransactionType } from "@features/transactions/models/transaction.types";

export interface DashboardSummary {
    currency: string;
    totalBalance: number;
    totalIncome: SummaryCard;
    totalExpenses: SummaryCard;
    totalSavings: SummaryCard;
    monthlyTrends: MonthlyTrend[];
    expensesByCategory: CategoryExpense[];
    expensesByGroup: CategoryGroupExpense[];
    recentTransactions: DashboardTransaction[];
    upcomingPayments: DashboardTransaction[];
    wallets: DashboardWallet[];
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

export interface DashboardTransaction {
    transactionId: string;
    description: string;
    transactionDate: Date;
    maxPaymentDate: Date;
    paymentMethodName: string;
    currency: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    category: DashboardTransactionCategory;
}

export interface DashboardTransactionCategory {
    categoryId: string;
    name: string;
    type: TransactionType;
    color: string;
    group: CategoryGroup;
}

export interface DashboardWallet {
    walletId: string;
    name: string;
    currencyCode: string;
    availableAmount: number;
    savingsAmount: number;
    totalAmount: number;
    color: string;
}