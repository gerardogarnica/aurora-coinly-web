import { TransactionType, TransactionStatus } from '../models/transaction.types';
import { Category } from '@features/categories/models/category.model';
import { Method } from '@features/methods/models/method.model';
import { Wallet } from '@features/wallets/models/wallet.model';

export interface Transaction {
    transactionId: string;
    description: string;
    category: Category;
    transactionDate: Date;
    maxPaymentDate: Date;
    paymentDate?: Date;
    currency: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    isPaid: boolean;
    paymentMethod: Method;
    wallet: Wallet;
    notes?: string;
    isRecurring: boolean;
    installmentNumber: number;
}

export interface CreateExpenseTransaction {
    categoryId: string;
    paymentMethodId: string;
    description: string;
    transactionDate: Date;
    maxPaymentDate: Date;
    currencyCode: string;
    amount: number;
    notes?: string;
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