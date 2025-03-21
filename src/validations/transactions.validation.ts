import { z } from 'zod';

export const transactionSchema = z.object({
  myMoney: z.boolean(),
  amount: z.number(),
  transactionType: z.enum(['Receive', 'Give', 'Transfer']),
  date: z.coerce.string(),
  to: z.coerce.string(),
  from: z.coerce.string(),
  category: z.enum([
    'Salary',
    'Deposit',
    'Transfer',
    'Purchase',
    'Mortgage',
    'Bill',
    'Tax',
    'Loan',
  ]),
  description: z.coerce.string(),
  bank: z.string(),
});

export const transactionsSchema = z
  .array(transactionSchema)
  .nonempty('Transactions should have at least one transaction');
