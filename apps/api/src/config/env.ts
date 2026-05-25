type NodeEnv = "development" | "test" | "production";

type Env = {
  nodeEnv: NodeEnv;
  isProduction: boolean;
  apiPort: number;
  apiBaseUrl: string;
  webOrigin: string;
  corsOrigin: string;
};

const DEFAULT_API_PORT = 3001;
const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";
const DEFAULT_WEB_ORIGIN = "http://localhost:3000";

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

function validateProductionEnv(env: Env) {
  if (!env.isProduction) {
    return;
  }

  if (env.corsOrigin === "*") {
    throw new Error("CORS_ORIGIN must not be '*' in production.");
  }

  if (env.webOrigin.startsWith("http://")) {
    throw new Error("WEB_ORIGIN must use HTTPS in production.");
  }

  if (env.corsOrigin.startsWith("http://")) {
    throw new Error("CORS_ORIGIN must use HTTPS in production.");
  }
}

function loadEnv(): Env {
  const nodeEnv = readNodeEnv();
  const env = {
    nodeEnv,
    isProduction: nodeEnv === "production",
    apiPort: readPort(),
    apiBaseUrl: readString("API_BASE_URL", DEFAULT_API_BASE_URL),
    webOrigin: readString("WEB_ORIGIN", DEFAULT_WEB_ORIGIN),
    corsOrigin: readString("CORS_ORIGIN", DEFAULT_WEB_ORIGIN),
  };

  validateProductionEnv(env);

  return env;
}

export const env = loadEnv();

