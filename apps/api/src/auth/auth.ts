import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { accounts, db, sessions, users, verifications } from "@quarry/db";
import { betterAuth } from "better-auth";
import { env } from "../config/env";

const apiOrigin = new URL(env.apiBaseUrl).origin;

export const auth = betterAuth({
  baseURL: apiOrigin,
  basePath: "/api/v1/auth",
  secret: env.authSecret,
  trustedOrigins: [env.webOrigin, env.corsOrigin],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
      verifications,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
    },
  },
});

export type Auth = typeof auth;
