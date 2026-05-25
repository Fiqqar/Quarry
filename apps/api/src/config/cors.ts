import { Elysia } from "elysia";
import { env } from "./env";

const ALLOWED_METHODS = "GET,POST,PATCH,DELETE,OPTIONS";
const ALLOWED_HEADERS = "Content-Type,Authorization,X-Request-Id";

function isAllowedOrigin(origin: string | null) {
  if (!origin) {
    return true;
  }

  if (origin === env.corsOrigin) {
    return true;
  }

  return !env.isProduction && origin === env.webOrigin;
}

function setCorsHeaders(headers: Record<string, string | number>, origin: string | null) {
  const allowOrigin = origin && isAllowedOrigin(origin) ? origin : env.corsOrigin;

  headers["Access-Control-Allow-Origin"] = allowOrigin;
  headers["Access-Control-Allow-Methods"] = ALLOWED_METHODS;
  headers["Access-Control-Allow-Headers"] = ALLOWED_HEADERS;
  headers["Access-Control-Allow-Credentials"] = "true";
  headers["Vary"] = "Origin";
}

export const cors = new Elysia({ name: "cors" }).onRequest(({ request, set }) => {
  const origin = request.headers.get("origin");

  if (!isAllowedOrigin(origin)) {
    set.status = 403;
    return {
      success: false,
      error: {
        code: "CORS_ORIGIN_NOT_ALLOWED",
        message: "Origin is not allowed.",
      },
    };
  }

  setCorsHeaders(set.headers, origin);

  if (request.method === "OPTIONS") {
    set.status = 204;
    return "";
  }
});
