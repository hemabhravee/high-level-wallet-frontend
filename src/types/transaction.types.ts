export enum TransactionType {
  debit = 'DEBIT',
  credit = 'CREDIT'
}

/**
 * Labels for displaying transaction types in a user-friendly format
 */
export const TransactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.debit]: 'Debit',
  [TransactionType.credit]: 'Credit'
};

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  balance: number; // this is the balance after the transaction
  description: string;
  date: Date;
};