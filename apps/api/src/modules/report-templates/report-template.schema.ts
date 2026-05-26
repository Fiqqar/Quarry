import { AppError } from "../../common/errors/app-error";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseReportTemplateId(templateId: string) {
  if (!UUID_PATTERN.test(templateId)) {
    throw new AppError({
      code: "REPORT_TEMPLATE_NOT_FOUND",
      message: "Report template not found",
      statusCode: 404,
    });
  }

  return templateId;
}
