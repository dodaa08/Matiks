import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@repo/common/utils";
import { OpsSign, Result } from "./generated/prisma/client";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
export const db = new PrismaClient({adapter});

export {OpsSign, Result};