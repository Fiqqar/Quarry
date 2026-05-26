import { Elysia } from "elysia";
import { authRoutes } from "./auth/auth.handler";
import { errorHandler } from "./common/errors/error-handler";
import { requestId } from "./common/middleware/request-id";
import { success } from "./common/response/success";
import { cors } from "./config/cors";
import { healthRoutes } from "./modules/health/health.routes";
import { programRoutes } from "./modules/programs/program.routes";

export const app = new Elysia()
  .use(requestId)
  .use(cors)
  .onError(errorHandler)
  .get("/", () =>
    success({
      name: "quarry-api",
      status: "ok",
    }),
  )
  .use(authRoutes)
  .group("/api/v1", (api) => api.use(healthRoutes).use(programRoutes));
