import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

declare const process: {
  env: Record<string, string | undefined>;
};

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/quarry",
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;

