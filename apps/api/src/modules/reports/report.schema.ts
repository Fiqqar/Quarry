import { AppError } from "../../common/errors/app-error";

export type GenerateReportData = {
  templateId: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validationError(message: string) {
  return new AppError({
    code: "VALIDATION_ERROR",
    message,
    statusCode: 400,
  });
}

function notFoundError(code: "FINDING_NOT_FOUND" | "GENERATED_REPORT_NOT_FOUND", message: string) {
  return new AppError({
    code,
    message,
    statusCode: 404,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseUuid(value: unknown, code: "FINDING_NOT_FOUND" | "GENERATED_REPORT_NOT_FOUND", message: string) {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw notFoundError(code, message);
  }

  return value;
}

export function parseFindingId(findingId: string) {
  return parseUuid(findingId, "FINDING_NOT_FOUND", "Finding not found");
}

export function parseReportId(reportId: string) {
  return parseUuid(reportId, "GENERATED_REPORT_NOT_FOUND", "Generated report not found");
}

export function parseGenerateReportBody(body: unknown): GenerateReportData {
  if (!isRecord(body)) {
    throw validationError("Request body must be an object.");
  }

  const templateId = body.templateId;

  if (typeof templateId !== "string" || !UUID_PATTERN.test(templateId)) {
    throw validationError("templateId must be a valid UUID.");
  }

  return {
    templateId,
  };
}
