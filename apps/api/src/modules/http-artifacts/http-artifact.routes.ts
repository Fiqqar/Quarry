import { Elysia } from "elysia";
import { requireAuth } from "../../common/guards/require-auth";
import {
  createHttpArtifactController,
  deleteHttpArtifactController,
  getHttpArtifactController,
  listHttpArtifactsController,
} from "./http-artifact.controller";

export const httpArtifactRoutes = new Elysia({ prefix: "/http-artifacts" })
  .use(requireAuth)
  .get("/", ({ currentUser, query }) => listHttpArtifactsController(currentUser, query))
  .post("/", ({ currentUser, body, set }) => {
    set.status = 201;

    return createHttpArtifactController(currentUser, body);
  })
  .get("/:artifactId", ({ currentUser, params }) =>
    getHttpArtifactController(currentUser, params.artifactId),
  )
  .delete("/:artifactId", ({ currentUser, params }) =>
    deleteHttpArtifactController(currentUser, params.artifactId),
  );
