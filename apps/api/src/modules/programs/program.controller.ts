import { success } from "../../common/response/success";
import {
  parseCreateProgramBody,
  parseListProgramsQuery,
  parseProgramId,
  parseUpdateProgramBody,
} from "./program.schema";
import {
  createUserProgram,
  deleteUserProgram,
  getUserProgram,
  listUserPrograms,
  updateUserProgram,
} from "./program.service";

type CurrentUser = {
  id: string;
};

export async function listProgramsController(
  currentUser: CurrentUser,
  query: Record<string, unknown>,
) {
  const parsedQuery = parseListProgramsQuery(query);
  const result = await listUserPrograms(currentUser.id, parsedQuery);

  return success(result.programs, result.meta);
}

export async function createProgramController(currentUser: CurrentUser, body: unknown) {
  const input = parseCreateProgramBody(body);
  const program = await createUserProgram(currentUser.id, input);

  return success(program);
}

export async function getProgramController(currentUser: CurrentUser, programId: string) {
  const parsedProgramId = parseProgramId(programId);
  const program = await getUserProgram(currentUser.id, parsedProgramId);

  return success(program);
}

export async function updateProgramController(
  currentUser: CurrentUser,
  programId: string,
  body: unknown,
) {
  const parsedProgramId = parseProgramId(programId);
  const input = parseUpdateProgramBody(body);
  const program = await updateUserProgram(currentUser.id, parsedProgramId, input);

  return success(program);
}

export async function deleteProgramController(currentUser: CurrentUser, programId: string) {
  const parsedProgramId = parseProgramId(programId);

  await deleteUserProgram(currentUser.id, parsedProgramId);

  return success({
    deleted: true,
  });
}
