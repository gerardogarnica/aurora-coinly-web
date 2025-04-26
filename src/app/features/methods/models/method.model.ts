export interface Method {
  paymentMethodId: string;
  name: string;
  isDefault: boolean;
  allowRecurring: boolean;
  autoMarkAsPaid: boolean;
  relatedWalletId: string;
  suggestedPaymentDay?: number;
  statementCutoffDay?: number;
  isDeleted: boolean;
  notes?: string;
}