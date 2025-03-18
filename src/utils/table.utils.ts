import AWS from 'aws-sdk';
import env from '../validations/env.validation';
import { User } from '../interfaces/user.interface';

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: env.REGION });
const USERS_TABLE = env.USERS_TABLE;

export const addUser = async (user: User) => {
  await dynamoDB
    .put({
      TableName: USERS_TABLE,
      Item: user,
    })
    .promise();
};

export const getUser = async (id: string) => {
  const data = await dynamoDB
    .get({
      TableName: USERS_TABLE,
      Key: {
        id: id,
      },
    })
    .promise();
  return data.Item;
};
