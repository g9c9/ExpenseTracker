import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().min(443).max(9999),
  REGION: z.coerce.string(),
  APP_ORIGIN: z.string().url(),
  NODE_ENV: z.union([z.literal('dev'), z.literal('prod')]).default('dev'),
  SECRET_KEY: z.coerce
    .string({
      required_error: 'SECRET_KEY is required',
    })
    .min(32, 'JWT_SECRET must be at least 32 characters long')
    .regex(/[a-z]/, 'JWT_SECRET must contain at least one lowercase letter')
    .regex(/\d/, 'JWT_SECRET must contain at least one number'),
  USERS_TABLE: z.coerce.string(),
  CERTS_DIR: z.string().startsWith('./'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Environment variable validation failed');
  console.error('Issues found:');
  Object.entries(env.error.format()).forEach(([key, value]) => {
    const errors = Array.isArray(value) ? value : value._errors;
    if (errors.length > 0) console.error(`  ❌ ${key}: ${errors.join(', ')}`);
  });

  process.exit(1);
}

export default env.data;
