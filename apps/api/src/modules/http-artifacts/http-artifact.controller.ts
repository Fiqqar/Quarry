import { success } from "../../common/response/success";
import {
  parseCreateHttpArtifactBody,
  parseHttpArtifactId,
  parseListHttpArtifactsQuery,
} from "./http-artifact.schema";
import {
  createUserHttpArtifact,
  deleteUserHttpArtifact,
  getUserHttpArtifact,
  listUserHttpArtifacts,
} from "./http-artifact.service";

type CurrentUser = {
  id: string;
};

export async function listHttpArtifactsController(
  currentUser: CurrentUser,
  query: Record<string, unknown>,
) {
  const parsedQuery = parseListHttpArtifactsQuery(query);
  const result = await listUserHttpArtifacts(currentUser.id, parsedQuery);

  return success(result.artifacts, result.meta);
}

export async function createHttpArtifactController(currentUser: CurrentUser, body: unknown) {
  const input = parseCreateHttpArtifactBody(body);
  const artifact = await createUserHttpArtifact(currentUser.id, input);

  return success(artifact);
}

export async function getHttpArtifactController(currentUser: CurrentUser, artifactId: string) {
  const parsedArtifactId = parseHttpArtifactId(artifactId);
  const artifact = await getUserHttpArtifact(currentUser.id, parsedArtifactId);

  return success(artifact);
}

export async function deleteHttpArtifactController(currentUser: CurrentUser, artifactId: string) {
  const parsedArtifactId = parseHttpArtifactId(artifactId);

  await deleteUserHttpArtifact(currentUser.id, parsedArtifactId);

  return success({
    deleted: true,
  });
}
