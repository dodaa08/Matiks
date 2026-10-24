// packages/common/utils.ts
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Loads packages/common/.env regardless of where the app is started from
dotenv.config({ path: path.resolve(import.meta.dir, ".env") });

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWTTOKEN: z.string().min(6),
});

export const env = EnvSchema.parse(process.env);