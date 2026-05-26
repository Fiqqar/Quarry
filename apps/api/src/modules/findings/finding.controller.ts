import { success } from "../../common/response/success";
import {
  parseCreateFindingBody,
  parseFindingId,
  parseListFindingsQuery,
  parseUpdateFindingBody,
} from "./finding.schema";
import {
  createUserFinding,
  deleteUserFinding,
  getUserFinding,
  listUserFindings,
  updateUserFinding,
} from "./finding.service";

type CurrentUser = {
  id: string;
};

export async function listFindingsController(
  currentUser: CurrentUser,
  query: Record<string, unknown>,
) {
  const parsedQuery = parseListFindingsQuery(query);
  const result = await listUserFindings(currentUser.id, parsedQuery);

  return success(result.findings, result.meta);
}

export async function createFindingController(currentUser: CurrentUser, body: unknown) {
  const input = parseCreateFindingBody(body);
  const finding = await createUserFinding(currentUser.id, input);

  return success(finding);
}

export async function getFindingController(currentUser: CurrentUser, findingId: string) {
  const parsedFindingId = parseFindingId(findingId);
  const finding = await getUserFinding(currentUser.id, parsedFindingId);

  return success(finding);
}

export async function updateFindingController(
  currentUser: CurrentUser,
  findingId: string,
  body: unknown,
) {
  const parsedFindingId = parseFindingId(findingId);
  const input = parseUpdateFindingBody(body);
  const finding = await updateUserFinding(currentUser.id, parsedFindingId, input);

  return success(finding);
}

export async function deleteFindingController(currentUser: CurrentUser, findingId: string) {
  const parsedFindingId = parseFindingId(findingId);

  await deleteUserFinding(currentUser.id, parsedFindingId);

  return success({
    deleted: true,
  });
}
