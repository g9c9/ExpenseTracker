import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from '../validations/env.validation';
import { UserRequest } from '../interfaces/userRequest.interface';

export const authenticate = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({ error: 'Access Denied' });
    return;
  }

  try {
    const verified = jwt.verify(token, env.SECRET_KEY) as JwtPayload;
    req.user = verified;
    next();
  } catch (error) {
    console.log(' ❌ Authentication Token Error: ', error);
    res.status(400).json({ error: 'Invalid Token' });
    return;
  }
};
