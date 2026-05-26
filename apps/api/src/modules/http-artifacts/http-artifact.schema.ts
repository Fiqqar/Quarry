import { RAW_HTTP_INPUT_MAX_LENGTH } from "@quarry/shared";
import { AppError } from "../../common/errors/app-error";

export type CreateHttpArtifactData = {
  findingId: string;
  rawRequest: string | null;
  rawResponse: string | null;
  notes: string | null;
};

export type ListHttpArtifactsQuery = {
  findingId: string | null;
  page: number;
  limit: number;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const NOTES_MAX_LENGTH = 5_000;

function validationError(message: string) {
  return new AppError({
    code: "VALIDATION_ERROR",
    message,
    statusCode: 400,
  });
}

function notFoundError(code: "FINDING_NOT_FOUND" | "HTTP_ARTIFACT_NOT_FOUND", message: string) {
  return new AppError({
    code,
    message,
    statusCode: 404,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePositiveInteger(value: unknown, fallback: number, field: string) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw validationError(`${field} must be a positive integer.`);
  }

  return parsed;
}

function readOptionalString(
  input: Record<string, unknown>,
  key: string,
  maxLength: number,
): string | null | undefined {
  if (!(key in input)) {
    return undefined;
  }

  const value = input[key];

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw validationError(`${key} must be a string.`);
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.length > maxLength) {
    throw validationError(`${key} must be at most ${maxLength} characters.`);
  }

  return trimmed;
}

function parseFindingIdValue(value: unknown) {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw notFoundError("FINDING_NOT_FOUND", "Finding not found");
  }

  return value;
}

export function parseHttpArtifactId(artifactId: string) {
  if (!UUID_PATTERN.test(artifactId)) {
    throw notFoundError("HTTP_ARTIFACT_NOT_FOUND", "HTTP artifact not found");
  }

  return artifactId;
}

export function parseListHttpArtifactsQuery(query: Record<string, unknown>): ListHttpArtifactsQuery {
  const findingId = query.findingId === undefined ? null : parseFindingIdValue(query.findingId);
  const page = parsePositiveInteger(query.page, DEFAULT_PAGE, "page");
  const requestedLimit = parsePositiveInteger(query.limit, DEFAULT_LIMIT, "limit");

  return {
    findingId,
    page,
    limit: Math.min(requestedLimit, MAX_LIMIT),
  };
}

export function parseCreateHttpArtifactBody(body: unknown): CreateHttpArtifactData {
  if (!isRecord(body)) {
    throw validationError("Request body must be an object.");
  }

  const rawRequest = readOptionalString(body, "rawRequest", RAW_HTTP_INPUT_MAX_LENGTH) ?? null;
  const rawResponse = readOptionalString(body, "rawResponse", RAW_HTTP_INPUT_MAX_LENGTH) ?? null;
  const notes = readOptionalString(body, "notes", NOTES_MAX_LENGTH) ?? null;

  if (!rawRequest && !rawResponse) {
    throw validationError("rawRequest or rawResponse is required.");
  }

  return {
    findingId: parseFindingIdValue(body.findingId),
    rawRequest,
    rawResponse,
    notes,
  };
}
