import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
// Prefer a single `.env` file, then fall back to env-specific variants
const candidates = [
  `.env`,
  `.env.${env}.local`,
  `.env.${env}`,
  `.env.local`,
];

for (const file of candidates) {
  const full = path.resolve(process.cwd(), file);
  if (fs.existsSync(full)) {
    dotenv.config({ path: full });
    break;
  }
}

export {};