import { authenticate } from '../validations/jwt.validation';
import { transactionsSchema } from '../validations/transactions.validation';
import { validateRequest } from '../validations/validation';
import express, { NextFunction, Response } from 'express';
import { UserRequest } from '../interfaces/userRequest.interface';
import { User } from '../interfaces/user.interface';
import { addTransactions, getUser } from '../utils/table.utils';
import {
  Transaction,
  TransactionInput,
} from '../interfaces/transaction.interface';
import { ClientError } from '../errors/client.error';
import { getUpdatedBankBalances } from '../utils/transactions.utils';

const router = express.Router();

router.post(
  '/',
  authenticate,
  validateRequest(transactionsSchema),
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user: User | null = await getUser(req.user.id);

      if (!user) throw new ClientError("User not found");

      const transactions: Transaction[] = (
        req.body as TransactionInput[]
      ).map((transactionInput, index) => ({
        ...transactionInput,
        userId: user?.id,
        id: user?.transactionCount + index,
      }));
      
      const updatedBankBalances: Record<string, number> = getUpdatedBankBalances(user, transactions);
      
      console.log(updatedBankBalances);

      // await addTransactions(transactions);
      
      res.status(200).json({ message: 'Transactions successfully stored' });
      return;
    } catch (error) {
      next(error);
    }
  },
);

export default router;
