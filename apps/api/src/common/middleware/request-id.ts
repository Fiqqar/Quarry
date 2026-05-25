import { Elysia } from "elysia";

const REQUEST_ID_HEADER = "x-request-id";

export const requestId = new Elysia({ name: "request-id" }).onRequest(({ request, set }) => {
  const requestId = request.headers.get(REQUEST_ID_HEADER) ?? crypto.randomUUID();

  set.headers["X-Request-Id"] = requestId;
});
