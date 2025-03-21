import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import env from '../validations/env.validation';
import { User } from '../interfaces/user.interface';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Transaction } from '@/interfaces/transaction.interface';

const client = new DynamoDBClient({ region: env.REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);
const USERS_TABLE = env.USERS_TABLE;

export const addUser = async (user: User) => {
  await dynamoDB.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    }),
  );
};

export const getUser = async (id: string): Promise<User | null> => {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: {
        id: id,
      },
    }),
  );
  return (result.Item as User) || null;
};

export const getUserEmail = async (email: string): Promise<User | null> => {
  const result = await dynamoDB.send(
    new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }),
  );

  return (result.Items?.[0] as User) || null;
};

export const addTransactions = async (transactions: Transaction[]) => {
  const putRequests = transactions.map((transaction) => ({
    PutRequest: { Item: transaction },
  }));
  await dynamoDB.send(
    new BatchWriteCommand({
      RequestItems: {
        [env.TRANSACTIONS_TABLE]: putRequests,
      },
    }),
  );
};
