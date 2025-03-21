import { ClientError } from "../errors/client.error";
import { Transaction } from "../interfaces/transaction.interface";
import { User } from "../interfaces/user.interface";

export const getUpdatedBankBalances = (user: User, transactions: Transaction[]) : Record<string, number> => {
    const currentBankBalance: Record<string, number> = user.bankBalances;

    transactions.forEach((val: Transaction) => {
        let newBalance = currentBankBalance[val.bank] || 0;
        if (val.transactionType === "Receive") {
            newBalance += val.amount
        }
        else if (val.transactionType === "Give") {
            newBalance -= val.amount
            if (newBalance < 0) throw new ClientError(`Insufficient funds in ${val.bank}`);
        }
        else {
            if (!currentBankBalance[val.from]) throw new ClientError(`Bank ${val.from} doesn't exist`);
            currentBankBalance[val.from] -= val.amount;
            newBalance += val.amount
        }
        currentBankBalance[val.bank] = newBalance;
    })
    return currentBankBalance;
}