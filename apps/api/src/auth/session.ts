import { AppError } from "../common/errors/app-error";
import { auth } from "./auth";

export type CurrentSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export async function getCurrentSession(request: Request) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export async function requireCurrentSession(request: Request): Promise<CurrentSession> {
  const currentSession = await getCurrentSession(request);

  if (!currentSession) {
    throw new AppError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      statusCode: 401,
    });
  }

  return currentSession;
}
