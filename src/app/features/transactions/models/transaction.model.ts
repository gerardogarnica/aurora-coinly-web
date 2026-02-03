import { TransactionType, TransactionStatus } from '../models/transaction.types';
import { CategoryGroup } from '@features/categories/models/category.model';
import { WalletType } from '@features/wallets/models/wallet.types';

export interface Transaction {
    transactionId: string;
    description: string;
    transactionDate: Date;
    maxPaymentDate: Date;
    paymentDate?: Date;
    currency: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    isPaid: boolean;
    category: TransactionCategory;
    paymentMethod: TransactionPaymentMethod;
    wallet: TransactionWallet;
    notes?: string;
    isRecurring: boolean;
    installmentNumber: number;
}

export interface TransactionCategory {
    categoryId: string;
    name: string;
    type: TransactionType;
    color: string;
    group: CategoryGroup;
}

export interface TransactionPaymentMethod {
    paymentMethodId: string;
    name: string;
}

export interface TransactionWallet {
    walletId: string;
    name: string;
    type: WalletType;
    color: string;
}

export interface CreateExpenseTransaction {
    categoryId: string;
    paymentMethodId: string;
    description: string;
    transactionDate: Date;
    currencyCode: string;
    amount: number;
    notes?: string;
    makePayment: boolean;
    walletId?: string;
}

export interface CreateIncomeTransaction {
    categoryId: string;
    description: string;
    transactionDate: Date;
    currencyCode: string;
    amount: number;
    notes?: string;
    walletId: string;
}

export interface PayPendingTransactions {
    transactionIds: string[];
    walletId: string;
    paymentDate: Date;
}