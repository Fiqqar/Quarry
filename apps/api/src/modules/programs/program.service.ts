import type { PaginationMeta, Program, ProgramListItem } from "@quarry/shared";
import { AppError } from "../../common/errors/app-error";
import type { CreateProgramData, ListProgramsQuery, UpdateProgramData } from "./program.schema";
import {
  createProgram,
  deleteProgram,
  findProgramById,
  listPrograms,
  type ProgramListRow,
  type ProgramRow,
  updateProgram,
} from "./program.repository";

function programNotFound() {
  return new AppError({
    code: "PROGRAM_NOT_FOUND",
    message: "Program not found",
    statusCode: 404,
  });
}

function toProgram(program: ProgramRow): Program {
  return {
    id: program.id,
    name: program.name,
    platform: program.platform,
    programUrl: program.programUrl,
    scopeNotes: program.scopeNotes,
    createdAt: program.createdAt.toISOString(),
    updatedAt: program.updatedAt.toISOString(),
  };
}

function toProgramListItem(program: ProgramListRow): ProgramListItem {
  return {
    ...toProgram(program),
    findingCount: program.findingCount,
  };
}

export async function listUserPrograms(userId: string, query: ListProgramsQuery) {
  const result = await listPrograms({
    userId,
    ...query,
  });

  const meta: PaginationMeta = {
    page: query.page,
    limit: query.limit,
    total: result.total,
  };

  return {
    programs: result.programs.map(toProgramListItem),
    meta,
  };
}

export async function createUserProgram(userId: string, input: CreateProgramData) {
  const program = await createProgram(userId, input);

  return toProgram(program);
}

export async function getUserProgram(userId: string, programId: string) {
  const program = await findProgramById(userId, programId);

  if (!program) {
    throw programNotFound();
  }

  return toProgram(program);
}

export async function updateUserProgram(
  userId: string,
  programId: string,
  input: UpdateProgramData,
) {
  const program = await updateProgram(userId, programId, input);

  if (!program) {
    throw programNotFound();
  }

  return toProgram(program);
}

export async function deleteUserProgram(userId: string, programId: string) {
  const deleted = await deleteProgram(userId, programId);

  if (!deleted) {
    throw programNotFound();
  }
}
