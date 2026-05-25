type NodeEnv = "development" | "test" | "production";

type Env = {
  nodeEnv: NodeEnv;
  isProduction: boolean;
  apiPort: number;
  apiBaseUrl: string;
  webOrigin: string;
  corsOrigin: string;
  databaseUrl: string;
  authSecret: string;
};

const DEFAULT_API_PORT = 3001;
const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";
const DEFAULT_WEB_ORIGIN = "http://localhost:3000";
const DEFAULT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/quarry";
const DEV_AUTH_SECRET = "development-only-quarry-auth-secret-change-me";
const PLACEHOLDER_AUTH_SECRETS = new Set([
  DEV_AUTH_SECRET,
  "replace-with-long-random-secret",
  "change-me",
]);

function readString(name: string, fallback: string) {
  const value = Bun.env[name];

  if (value && value.trim().length > 0) {
    return value.trim();
  }

  return fallback;
}

function readNodeEnv(): NodeEnv {
  const value = Bun.env.NODE_ENV;

  if (value === "test" || value === "production") {
    return value;
  }

  return "development";
}

function readPort() {
  const rawPort = Bun.env.API_PORT;

  if (!rawPort) {
    return DEFAULT_API_PORT;
  }

  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("API_PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function readUrl(name: string, fallback: string) {
  const value = readString(name, fallback);

  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error(`${name} must be a valid URL.`);
  }
}

function readOrigin(name: string, fallback: string) {
  const value = readString(name, fallback);

  if (value === "*") {
    throw new Error(`${name} must not be '*'.`);
  }

  try {
    const url = new URL(value);

    if (url.origin !== value.replace(/\/$/, "")) {
      throw new Error(`${name} must be an origin without a path.`);
    }

    return url.origin;
  } catch (error) {
    if (error instanceof Error && error.message.includes("without a path")) {
      throw error;
    }

    throw new Error(`${name} must be a valid origin.`);
  }
}

function validateAuthSecret(env: Env) {
  if (!env.isProduction) {
    return;
  }

  if (PLACEHOLDER_AUTH_SECRETS.has(env.authSecret) || env.authSecret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a strong non-placeholder secret in production.");
  }
}

function validateProductionEnv(env: Env) {
  validateAuthSecret(env);

  if (!env.isProduction) {
    return;
  }

  if (env.webOrigin.startsWith("http://")) {
    throw new Error("WEB_ORIGIN must use HTTPS in production.");
  }

  if (env.corsOrigin.startsWith("http://")) {
    throw new Error("CORS_ORIGIN must use HTTPS in production.");
  }

  if (env.apiBaseUrl.startsWith("http://")) {
    throw new Error("API_BASE_URL must use HTTPS in production.");
  }

  if (env.databaseUrl === DEFAULT_DATABASE_URL) {
    throw new Error("DATABASE_URL must be set explicitly in production.");
  }
}

function loadEnv(): Env {
  const nodeEnv = readNodeEnv();
  const env = {
    nodeEnv,
    isProduction: nodeEnv === "production",
    apiPort: readPort(),
    apiBaseUrl: readUrl("API_BASE_URL", DEFAULT_API_BASE_URL),
    webOrigin: readOrigin("WEB_ORIGIN", DEFAULT_WEB_ORIGIN),
    corsOrigin: readOrigin("CORS_ORIGIN", DEFAULT_WEB_ORIGIN),
    databaseUrl: readString("DATABASE_URL", DEFAULT_DATABASE_URL),
    authSecret: readString("AUTH_SECRET", DEV_AUTH_SECRET),
  };

  validateProductionEnv(env);

  return env;
}

export const env = loadEnv();
