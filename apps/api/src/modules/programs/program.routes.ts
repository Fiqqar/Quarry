import { Elysia } from "elysia";
import { requireAuth } from "../../common/guards/require-auth";
import {
  createProgramController,
  deleteProgramController,
  getProgramController,
  listProgramsController,
  updateProgramController,
} from "./program.controller";

export const programRoutes = new Elysia({ prefix: "/programs" })
  .use(requireAuth)
  .get("/", ({ currentUser, query }) => listProgramsController(currentUser, query))
  .post("/", ({ currentUser, body, set }) => {
    set.status = 201;

    return createProgramController(currentUser, body);
  })
  .get("/:programId", ({ currentUser, params }) =>
    getProgramController(currentUser, params.programId),
  )
  .patch("/:programId", ({ currentUser, params, body }) =>
    updateProgramController(currentUser, params.programId, body),
  )
  .delete("/:programId", ({ currentUser, params }) =>
    deleteProgramController(currentUser, params.programId),
  );
