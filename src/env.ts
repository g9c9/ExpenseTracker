import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().min(3000).max(9999),
    APP_ORIGIN: z.string().url(),
    NODE_ENV: z
        .union([z.literal("dev"), z.literal("prod")])
        .default("dev"),
});

const env = envSchema.parse(process.env);

export default env;