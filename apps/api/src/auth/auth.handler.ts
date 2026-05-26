import { Elysia } from "elysia";
import { AppError } from "../common/errors/app-error";
import { success } from "../common/response/success";
import { auth } from "./auth";
import { getCurrentSession } from "./session";

const BETTER_AUTH_METHODS = new Set(["GET", "POST"]);

function toSafeUser(user: NonNullable<Awaited<ReturnType<typeof getCurrentSession>>>["user"]) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
  };
}

export const authRoutes = new Elysia({ name: "auth-routes" })
  .get("/api/v1/auth/me", async ({ request, set }) => {
    set.headers["Cache-Control"] = "no-store";

    const currentSession = await getCurrentSession(request);

    if (!currentSession) {
      set.status = 401;

      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      };
    }

    return success(toSafeUser(currentSession.user));
  })
  .all("/api/v1/auth/*", ({ request, set }) => {
    set.headers["Cache-Control"] = "no-store";

    if (!BETTER_AUTH_METHODS.has(request.method)) {
      throw new AppError({
        code: "METHOD_NOT_ALLOWED",
        message: "Method not allowed",
        statusCode: 405,
      });
    }

    return auth.handler(request);
  });
