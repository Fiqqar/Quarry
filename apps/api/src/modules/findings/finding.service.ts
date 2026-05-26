import type { Finding, PaginationMeta } from "@quarry/shared";
import { AppError } from "../../common/errors/app-error";
import { findProgramById } from "../programs/program.repository";
import type { CreateFindingData, ListFindingsQuery, UpdateFindingData } from "./finding.schema";
import {
  createFinding,
  deleteFinding,
  findFindingById,
  listFindings,
  type FindingRow,
  updateFinding,
} from "./finding.repository";

function findingNotFound() {
  return new AppError({
    code: "FINDING_NOT_FOUND",
    message: "Finding not found",
    statusCode: 404,
  });
}

function programNotFound() {
  return new AppError({
    code: "PROGRAM_NOT_FOUND",
    message: "Program not found",
    statusCode: 404,
  });
}

function toFinding(finding: FindingRow): Finding {
  return {
    id: finding.id,
    programId: finding.programId,
    title: finding.title,
    severity: finding.severity as Finding["severity"],
    priority: finding.priority as Finding["priority"],
    status: finding.status as Finding["status"],
    weakness: finding.weakness,
    affectedUrl: finding.affectedUrl,
    affectedMethod: finding.affectedMethod,
    rootCause: finding.rootCause,
    impact: finding.impact,
    stepsToReproduce: finding.stepsToReproduce,
    remediation: finding.remediation,
    internalNotes: finding.internalNotes,
    createdAt: finding.createdAt.toISOString(),
    updatedAt: finding.updatedAt.toISOString(),
  };
}

async function ensureUserOwnsProgram(userId: string, programId: string) {
  const program = await findProgramById(userId, programId);

  if (!program) {
    throw programNotFound();
  }
}

export async function listUserFindings(userId: string, query: ListFindingsQuery) {
  if (query.programId) {
    await ensureUserOwnsProgram(userId, query.programId);
  }

  const result = await listFindings({
    userId,
    ...query,
  });

  const meta: PaginationMeta = {
    page: query.page,
    limit: query.limit,
    total: result.total,
  };

  return {
    findings: result.findings.map(toFinding),
    meta,
  };
}

export async function createUserFinding(userId: string, input: CreateFindingData) {
  await ensureUserOwnsProgram(userId, input.programId);

  const finding = await createFinding(userId, input);

  return toFinding(finding);
}

export async function getUserFinding(userId: string, findingId: string) {
  const finding = await findFindingById(userId, findingId);

  if (!finding) {
    throw findingNotFound();
  }

  return toFinding(finding);
}

export async function updateUserFinding(
  userId: string,
  findingId: string,
  input: UpdateFindingData,
) {
  if (input.programId) {
    await ensureUserOwnsProgram(userId, input.programId);
  }

  const finding = await updateFinding(userId, findingId, input);

  if (!finding) {
    throw findingNotFound();
  }

  return toFinding(finding);
}

export async function deleteUserFinding(userId: string, findingId: string) {
  const deleted = await deleteFinding(userId, findingId);

  if (!deleted) {
    throw findingNotFound();
  }
}
