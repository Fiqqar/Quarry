import { defineConfig } from "drizzle-kit";

declare const process: {
  env: Record<string, string | undefined>;
};

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/*.schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/quarry",
  },
});

