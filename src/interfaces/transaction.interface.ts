export interface TransactionInput {
  myMoney: boolean;
  amount: number;
  transactionType: 'Receive' | 'Give' | 'Transfer';
  date: string;
  to: string;
  from: string;
  category:
    | 'Salary'
    | 'Deposit'
    | 'Transfer'
    | 'Purchase'
    | 'Mortgage'
    | 'Bill'
    | 'Tax'
    | 'Loan';
  description: string;
  bank: string;
}

export interface Transaction extends TransactionInput {
  id: number;
  userId: string;
}
