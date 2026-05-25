import { Elysia } from "elysia";
import { success } from "../../common/response/success";

export const healthRoutes = new Elysia({ prefix: "/health" }).get("/", () =>
  success({
    status: "ok",
    service: "quarry-api",
    timestamp: new Date().toISOString(),
  }),
);

