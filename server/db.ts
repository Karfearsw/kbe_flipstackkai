import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const primaryUrl = process.env.DATABASE_URL;
if (!primaryUrl) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: primaryUrl, ssl: { rejectUnauthorized: false } });
export const db = drizzle(pool, { schema });

// Optional backup connection (e.g., Neon)
export const backupPool = process.env.BACKUP_DATABASE_URL
  ? new Pool({ connectionString: process.env.BACKUP_DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : undefined;