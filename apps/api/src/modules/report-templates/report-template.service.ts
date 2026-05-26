import type { ReportTemplate, ReportTemplateListItem } from "@quarry/shared";
import { AppError } from "../../common/errors/app-error";
import {
  findAccessibleReportTemplateById,
  listAccessibleReportTemplates,
  type ReportTemplateRow,
} from "./report-template.repository";

function templateNotFound() {
  return new AppError({
    code: "REPORT_TEMPLATE_NOT_FOUND",
    message: "Report template not found",
    statusCode: 404,
  });
}

function toReportTemplate(template: ReportTemplateRow): ReportTemplate {
  return {
    id: template.id,
    name: template.name,
    weakness: template.weakness,
    contentMarkdown: template.contentMarkdown,
    isDefault: template.isDefault,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  };
}

function toReportTemplateListItem(template: ReportTemplateRow): ReportTemplateListItem {
  return {
    id: template.id,
    name: template.name,
    weakness: template.weakness,
    isDefault: template.isDefault,
  };
}

export async function listUserReportTemplates(userId: string) {
  const templates = await listAccessibleReportTemplates(userId);

  return templates.map(toReportTemplateListItem);
}

export async function getUserReportTemplate(userId: string, templateId: string) {
  const template = await findAccessibleReportTemplateById(userId, templateId);

  if (!template) {
    throw templateNotFound();
  }

  return toReportTemplate(template);
}
