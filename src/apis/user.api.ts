import express, { Request, Response } from 'express';
import { validateRequest } from '../validations/validation';
import { registerSchema } from '../validations/users.validation';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from '../interfaces/user.interface';
import { addUser } from '../utils/table.utils';

const router = express.Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  async (req: Request, res: Response) => {
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
  },
);

export default router;
