import express, { NextFunction, Request, Response } from 'express';
import { validateRequest } from '../validations/validation';
import { loginSchema, registerSchema } from '../validations/users.validation';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from '../interfaces/user.interface';
import { addUser, getUserEmail } from '../utils/table.utils';
import jwt from 'jsonwebtoken';
import env from '../validations/env.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a new userId
      const id = uuidv4();

      const newUser: User = {
        id: id,
        email: email,
        password: hashedPassword,
        name: name,
        totalBalance: 0,
        transactionCount: 0,
      };

      await addUser(newUser);

      res.json({ message: 'User registered successfully' });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/login',
  validateRequest(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await getUserEmail(email);
      if (!user) {
        res.status(400).json({ error: 'Invalid email or password' });
        return;
      }

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ error: 'Invalid email or password' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, env.SECRET_KEY, {
        expiresIn: '7d',
      });

      res.json({ token, userId: user.id });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
