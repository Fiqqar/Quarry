import { Elysia } from "elysia";

const REQUEST_ID_HEADER = "x-request-id";
const REQUEST_ID_PATTERN = /^[a-zA-Z0-9._:-]{1,128}$/;

function resolveRequestId(request: Request) {
  const requestId = request.headers.get(REQUEST_ID_HEADER);

  if (requestId && REQUEST_ID_PATTERN.test(requestId)) {
    return requestId;
  }

  return crypto.randomUUID();
}

export const requestId = new Elysia({ name: "request-id" }).onRequest(({ request, set }) => {
  set.headers["X-Request-Id"] = resolveRequestId(request);
});
