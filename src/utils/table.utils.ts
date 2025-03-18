import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import env from '../validations/env.validation';
import { User } from '../interfaces/user.interface';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({region: env.REGION});
const dynamoDB = DynamoDBDocument.from(client)
const USERS_TABLE = env.USERS_TABLE;

export const addUser = async (user: User) => {
  await dynamoDB
    .put({
      TableName: USERS_TABLE,
      Item: user,
    });
};

export const getUser = async (id: string) => {
  const data = await dynamoDB
    .get({
      TableName: USERS_TABLE,
      Key: {
        id: id,
      },
    });
  return data.Item;
};
