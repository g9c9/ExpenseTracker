import { z } from 'zod';

// ToDo: Handling whether email is already being used:
// https://blog.logrocket.com/schema-validation-typescript-zod/
export const registerSchema = z.object({
  email: z.string().email('Email is formatted incorrectly'),
  password: z.string(),
  name: z.string(),
});
