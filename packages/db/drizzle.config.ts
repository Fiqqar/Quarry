import { defineConfig } from "drizzle-kit";

declare const process: {
  env: Record<string, string | undefined>;
};

const DEFAULT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/quarry";

function resolveDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (databaseUrl) {
    return databaseUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL must be set in production.");
  }

  return DEFAULT_DATABASE_URL;
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/*.schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: resolveDatabaseUrl(),
  },
});
