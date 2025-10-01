export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense'
}

export enum TransactionStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Removed = 'Removed'
}

export enum TransactionDateFilterType {
  Transaction = 0,
  Payment = 1
}