import {
  FINDING_STATUSES,
  PRIORITIES,
  SEVERITIES,
  type FindingStatus,
  type Priority,
  type Severity,
} from "@quarry/shared";
import { AppError } from "../../common/errors/app-error";

export type CreateFindingData = {
  programId: string;
  title: string;
  severity: Severity;
  priority: Priority | null;
  status: FindingStatus;
  weakness: string | null;
  affectedUrl: string | null;
  affectedMethod: string | null;
  rootCause: string | null;
  impact: string | null;
  stepsToReproduce: string | null;
  remediation: string | null;
  internalNotes: string | null;
};

export type UpdateFindingData = Partial<CreateFindingData>;

export type ListFindingsQuery = {
  programId: string | null;
  severity: Severity | null;
  status: FindingStatus | null;
  search: string | null;
  page: number;
  limit: number;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function validationError(message: string) {
  return new AppError({
    code: "VALIDATION_ERROR",
    message,
    statusCode: 400,
  });
}

function notFoundError(code: "FINDING_NOT_FOUND" | "PROGRAM_NOT_FOUND", message: string) {
  return new AppError({
    code,
    message,
    statusCode: 404,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(input: Record<string, unknown>, key: string, minLength: number, maxLength: number) {
  const value = input[key];

  if (typeof value !== "string") {
    throw validationError(`${key} is required.`);
  }

  const trimmed = value.trim();

  if (trimmed.length < minLength) {
    throw validationError(`${key} must be at least ${minLength} characters.`);
  }

  if (trimmed.length > maxLength) {
    throw validationError(`${key} must be at most ${maxLength} characters.`);
  }

  return trimmed;
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

function readRequiredEnum<TValue extends string>(
  input: Record<string, unknown>,
  key: string,
  values: readonly TValue[],
) {
  const value = input[key];

  if (typeof value !== "string" || !values.includes(value as TValue)) {
    throw validationError(`${key} must be a valid value.`);
  }

  return value as TValue;
}

function readOptionalEnum<TValue extends string>(
  input: Record<string, unknown>,
  key: string,
  values: readonly TValue[],
): TValue | null | undefined {
  if (!(key in input)) {
    return undefined;
  }

  const value = input[key];

  if (value === null) {
    return null;
  }

  if (typeof value !== "string" || !values.includes(value as TValue)) {
    throw validationError(`${key} must be a valid value.`);
  }

  return value as TValue;
}

function readOptionalRequiredEnum<TValue extends string>(
  input: Record<string, unknown>,
  key: string,
  values: readonly TValue[],
): TValue | undefined {
  const value = readOptionalEnum(input, key, values);

  if (value === null) {
    throw validationError(`${key} must be a valid value.`);
  }

  return value;
}

function readOptionalUrl(input: Record<string, unknown>, key: string) {
  const value = readOptionalString(input, key, 2_000);

  if (!value) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw validationError(`${key} must be a valid HTTP(S) URL.`);
    }

    return url.toString();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw validationError(`${key} must be a valid HTTP(S) URL.`);
  }
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

function parseProgramIdValue(value: unknown) {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw notFoundError("PROGRAM_NOT_FOUND", "Program not found");
  }

  return value;
}

export function parseFindingId(findingId: string) {
  if (!UUID_PATTERN.test(findingId)) {
    throw notFoundError("FINDING_NOT_FOUND", "Finding not found");
  }

  return findingId;
}

export function parseListFindingsQuery(query: Record<string, unknown>): ListFindingsQuery {
  const rawProgramId = query.programId === undefined ? null : parseProgramIdValue(query.programId);
  const rawSearch = readOptionalString(query, "search", 180);
  const severity = readOptionalEnum(query, "severity", SEVERITIES);
  const status = readOptionalEnum(query, "status", FINDING_STATUSES);
  const page = parsePositiveInteger(query.page, DEFAULT_PAGE, "page");
  const requestedLimit = parsePositiveInteger(query.limit, DEFAULT_LIMIT, "limit");

  return {
    programId: rawProgramId,
    severity: severity ?? null,
    status: status ?? null,
    search: rawSearch ?? null,
    page,
    limit: Math.min(requestedLimit, MAX_LIMIT),
  };
}

export function parseCreateFindingBody(body: unknown): CreateFindingData {
  if (!isRecord(body)) {
    throw validationError("Request body must be an object.");
  }

  return {
    programId: parseProgramIdValue(body.programId),
    title: readString(body, "title", 3, 180),
    severity: readRequiredEnum(body, "severity", SEVERITIES),
    priority: readOptionalEnum(body, "priority", PRIORITIES) ?? null,
    status: readOptionalRequiredEnum(body, "status", FINDING_STATUSES) ?? "draft",
    weakness: readOptionalString(body, "weakness", 120) ?? null,
    affectedUrl: readOptionalUrl(body, "affectedUrl") ?? null,
    affectedMethod: readOptionalString(body, "affectedMethod", 20) ?? null,
    rootCause: readOptionalString(body, "rootCause", 10_000) ?? null,
    impact: readOptionalString(body, "impact", 10_000) ?? null,
    stepsToReproduce: readOptionalString(body, "stepsToReproduce", 15_000) ?? null,
    remediation: readOptionalString(body, "remediation", 10_000) ?? null,
    internalNotes: readOptionalString(body, "internalNotes", 10_000) ?? null,
  };
}

export function parseUpdateFindingBody(body: unknown): UpdateFindingData {
  if (!isRecord(body)) {
    throw validationError("Request body must be an object.");
  }

  const update: UpdateFindingData = {};

  if ("programId" in body) {
    update.programId = parseProgramIdValue(body.programId);
  }

  if ("title" in body) {
    update.title = readString(body, "title", 3, 180);
  }

  const severity = readOptionalRequiredEnum(body, "severity", SEVERITIES);
  const priority = readOptionalEnum(body, "priority", PRIORITIES);
  const status = readOptionalRequiredEnum(body, "status", FINDING_STATUSES);
  const weakness = readOptionalString(body, "weakness", 120);
  const affectedUrl = readOptionalUrl(body, "affectedUrl");
  const affectedMethod = readOptionalString(body, "affectedMethod", 20);
  const rootCause = readOptionalString(body, "rootCause", 10_000);
  const impact = readOptionalString(body, "impact", 10_000);
  const stepsToReproduce = readOptionalString(body, "stepsToReproduce", 15_000);
  const remediation = readOptionalString(body, "remediation", 10_000);
  const internalNotes = readOptionalString(body, "internalNotes", 10_000);

  if (severity !== undefined) update.severity = severity;
  if (priority !== undefined) update.priority = priority;
  if (status !== undefined) update.status = status;
  if (weakness !== undefined) update.weakness = weakness;
  if (affectedUrl !== undefined) update.affectedUrl = affectedUrl;
  if (affectedMethod !== undefined) update.affectedMethod = affectedMethod;
  if (rootCause !== undefined) update.rootCause = rootCause;
  if (impact !== undefined) update.impact = impact;
  if (stepsToReproduce !== undefined) update.stepsToReproduce = stepsToReproduce;
  if (remediation !== undefined) update.remediation = remediation;
  if (internalNotes !== undefined) update.internalNotes = internalNotes;

  if (Object.keys(update).length === 0) {
    throw validationError("At least one field must be provided.");
  }

  return update;
}
