import { Elysia } from "elysia";
import { requireAuth } from "../../common/guards/require-auth";
import {
  createFindingController,
  deleteFindingController,
  getFindingController,
  listFindingsController,
  updateFindingController,
} from "./finding.controller";

export const findingRoutes = new Elysia({ prefix: "/findings" })
  .use(requireAuth)
  .get("/", ({ currentUser, query }) => listFindingsController(currentUser, query))
  .post("/", ({ currentUser, body, set }) => {
    set.status = 201;

    return createFindingController(currentUser, body);
  })
  .get("/:findingId", ({ currentUser, params }) =>
    getFindingController(currentUser, params.findingId),
  )
  .patch("/:findingId", ({ currentUser, params, body }) =>
    updateFindingController(currentUser, params.findingId, body),
  )
  .delete("/:findingId", ({ currentUser, params }) =>
    deleteFindingController(currentUser, params.findingId),
  );
