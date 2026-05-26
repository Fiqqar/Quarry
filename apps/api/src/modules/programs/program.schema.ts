import { AppError } from "../../common/errors/app-error";

export type CreateProgramData = {
  name: string;
  platform: string | null;
  programUrl: string | null;
  scopeNotes: string | null;
};

export type UpdateProgramData = Partial<CreateProgramData>;

export type ListProgramsQuery = {
  search: string | null;
  page: number;
  limit: number;
};

const PROGRAM_ID_PATTERN =
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

function notFoundError() {
  return new AppError({
    code: "PROGRAM_NOT_FOUND",
    message: "Program not found",
    statusCode: 404,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function readRequiredName(input: Record<string, unknown>) {
  const value = input.name;

  if (typeof value !== "string") {
    throw validationError("name is required.");
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw validationError("name is required.");
  }

  if (trimmed.length > 120) {
    throw validationError("name must be at most 120 characters.");
  }

  return trimmed;
}

function validateProgramUrl(programUrl: string | null | undefined) {
  if (!programUrl) {
    return programUrl;
  }

  try {
    const url = new URL(programUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw validationError("programUrl must be a valid HTTP(S) URL.");
    }

    return url.toString();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw validationError("programUrl must be a valid HTTP(S) URL.");
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

export function parseProgramId(programId: string) {
  if (!PROGRAM_ID_PATTERN.test(programId)) {
    throw notFoundError();
  }

  return programId;
}

export function parseListProgramsQuery(query: Record<string, unknown>): ListProgramsQuery {
  const rawSearch = readOptionalString(query, "search", 120);
  const page = parsePositiveInteger(query.page, DEFAULT_PAGE, "page");
  const requestedLimit = parsePositiveInteger(query.limit, DEFAULT_LIMIT, "limit");

  return {
    search: rawSearch ?? null,
    page,
    limit: Math.min(requestedLimit, MAX_LIMIT),
  };
}

export function parseCreateProgramBody(body: unknown): CreateProgramData {
  if (!isRecord(body)) {
    throw validationError("Request body must be an object.");
  }

  const name = readRequiredName(body);
  const platform = readOptionalString(body, "platform", 80) ?? null;
  const programUrl = validateProgramUrl(readOptionalString(body, "programUrl", 2_000)) ?? null;
  const scopeNotes = readOptionalString(body, "scopeNotes", 5_000) ?? null;

  return {
    name,
    platform,
    programUrl,
    scopeNotes,
  };
}

export function parseUpdateProgramBody(body: unknown): UpdateProgramData {
  if (!isRecord(body)) {
    throw validationError("Request body must be an object.");
  }

  const update: UpdateProgramData = {};

  if ("name" in body) {
    update.name = readRequiredName(body);
  }

  const platform = readOptionalString(body, "platform", 80);
  const programUrl = validateProgramUrl(readOptionalString(body, "programUrl", 2_000));
  const scopeNotes = readOptionalString(body, "scopeNotes", 5_000);

  if (platform !== undefined) {
    update.platform = platform;
  }

  if (programUrl !== undefined) {
    update.programUrl = programUrl;
  }

  if (scopeNotes !== undefined) {
    update.scopeNotes = scopeNotes;
  }

  if (Object.keys(update).length === 0) {
    throw validationError("At least one field must be provided.");
  }

  return update;
}
