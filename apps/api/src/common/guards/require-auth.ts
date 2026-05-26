import { Elysia } from "elysia";
import { requireCurrentSession } from "../../auth/session";

export const requireAuth = new Elysia({ name: "require-auth" }).derive(
  { as: "scoped" },
  async ({ request }) => {
    const currentSession = await requireCurrentSession(request);

    return {
      currentSession,
      currentUser: currentSession.user,
    };
  },
);
