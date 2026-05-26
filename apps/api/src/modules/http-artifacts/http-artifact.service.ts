import type { HttpArtifact, HttpArtifactType, PaginationMeta } from "@quarry/shared";
import { AppError } from "../../common/errors/app-error";
import { parseAndRedactHttpArtifact } from "../../common/utils/http-parser";
import { findFindingById } from "../findings/finding.repository";
import type { CreateHttpArtifactData, ListHttpArtifactsQuery } from "./http-artifact.schema";
import {
  createHttpArtifact,
  deleteHttpArtifact,
  findHttpArtifactById,
  listHttpArtifacts,
  type HttpArtifactRow,
} from "./http-artifact.repository";

function artifactNotFound() {
  return new AppError({
    code: "HTTP_ARTIFACT_NOT_FOUND",
    message: "HTTP artifact not found",
    statusCode: 404,
  });
}

function findingNotFound() {
  return new AppError({
    code: "FINDING_NOT_FOUND",
    message: "Finding not found",
    statusCode: 404,
  });
}

function toHttpArtifact(artifact: HttpArtifactRow): HttpArtifact {
  return {
    id: artifact.id,
    findingId: artifact.findingId,
    type: artifact.type as HttpArtifactType,
    rawInput: artifact.rawInput,
    parsedMethod: artifact.parsedMethod,
    parsedUrl: artifact.parsedUrl,
    parsedHeaders: artifact.parsedHeaders,
    parsedBody: artifact.parsedBody,
    responseStatus: artifact.responseStatus,
    responseHeaders: artifact.responseHeaders,
    responseBody: artifact.responseBody,
    redactedOutput: artifact.redactedOutput,
    redactedFields: artifact.redactedFields,
    createdAt: artifact.createdAt.toISOString(),
    updatedAt: artifact.updatedAt.toISOString(),
  };
}

function resolveArtifactType(input: CreateHttpArtifactData): HttpArtifactType {
  if (input.rawRequest && input.rawResponse) {
    return "request_response_pair";
  }

  if (input.rawResponse) {
    return "response";
  }

  return "request";
}

async function ensureUserOwnsFinding(userId: string, findingId: string) {
  const finding = await findFindingById(userId, findingId);

  if (!finding) {
    throw findingNotFound();
  }
}

export async function listUserHttpArtifacts(userId: string, query: ListHttpArtifactsQuery) {
  if (query.findingId) {
    await ensureUserOwnsFinding(userId, query.findingId);
  }

  const result = await listHttpArtifacts({
    userId,
    ...query,
  });

  const meta: PaginationMeta = {
    page: query.page,
    limit: query.limit,
    total: result.total,
  };

  return {
    artifacts: result.artifacts.map(toHttpArtifact),
    meta,
  };
}

export async function createUserHttpArtifact(userId: string, input: CreateHttpArtifactData) {
  await ensureUserOwnsFinding(userId, input.findingId);

  const parsedArtifact = parseAndRedactHttpArtifact(input);
  const artifact = await createHttpArtifact({
    ...parsedArtifact,
    userId,
    findingId: input.findingId,
    type: resolveArtifactType(input),
  });

  return toHttpArtifact(artifact);
}

export async function getUserHttpArtifact(userId: string, artifactId: string) {
  const artifact = await findHttpArtifactById(userId, artifactId);

  if (!artifact) {
    throw artifactNotFound();
  }

  return toHttpArtifact(artifact);
}

export async function deleteUserHttpArtifact(userId: string, artifactId: string) {
  const deleted = await deleteHttpArtifact(userId, artifactId);

  if (!deleted) {
    throw artifactNotFound();
  }
}
