import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

declare const process: {
  env: Record<string, string | undefined>;
};

const { Pool } = pg;
const DEFAULT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/quarry";

function resolveDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl && databaseUrl.trim().length > 0) {
    return databaseUrl.trim();
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL must be set in production.");
  }

  return DEFAULT_DATABASE_URL;
}

export const pool = new Pool({
  connectionString: resolveDatabaseUrl(),
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
