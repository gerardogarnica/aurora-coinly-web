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