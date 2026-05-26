import type { GeneratedReport } from "@quarry/shared";
import { AppError } from "../../common/errors/app-error";
import { findFindingById } from "../findings/finding.repository";
import { listHttpArtifacts } from "../http-artifacts/http-artifact.repository";
import { findProgramById } from "../programs/program.repository";
import { findAccessibleReportTemplateById } from "../report-templates/report-template.repository";
import { createReportFilename, renderMarkdownReport } from "./report-renderer";
import {
  createGeneratedReport,
  findGeneratedReportById,
  findLatestGeneratedReportForFinding,
  type GeneratedReportRow,
} from "./report.repository";

function findingNotFound() {
  return new AppError({
    code: "FINDING_NOT_FOUND",
    message: "Finding not found",
    statusCode: 404,
  });
}

function templateNotFound() {
  return new AppError({
    code: "REPORT_TEMPLATE_NOT_FOUND",
    message: "Report template not found",
    statusCode: 404,
  });
}

function reportNotFound() {
  return new AppError({
    code: "GENERATED_REPORT_NOT_FOUND",
    message: "Generated report not found",
    statusCode: 404,
  });
}

function toGeneratedReport(report: GeneratedReportRow): GeneratedReport {
  return {
    id: report.id,
    findingId: report.findingId,
    templateId: report.templateId,
    contentMarkdown: report.contentMarkdown,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
  };
}

export async function generateUserReport(userId: string, findingId: string, templateId: string) {
  const finding = await findFindingById(userId, findingId);

  if (!finding) {
    throw findingNotFound();
  }

  const template = await findAccessibleReportTemplateById(userId, templateId);

  if (!template) {
    throw templateNotFound();
  }

  const program = await findProgramById(userId, finding.programId);
  const artifactResult = await listHttpArtifacts({
    userId,
    findingId,
    page: 1,
    limit: 100,
  });
  const contentMarkdown = renderMarkdownReport({
    finding,
    program: program ?? null,
    template,
    artifacts: artifactResult.artifacts,
  });
  const report = await createGeneratedReport({
    userId,
    findingId,
    templateId: template.id,
    contentMarkdown,
  });

  return toGeneratedReport(report);
}

export async function getLatestUserReportForFinding(userId: string, findingId: string) {
  const finding = await findFindingById(userId, findingId);

  if (!finding) {
    throw findingNotFound();
  }

  const report = await findLatestGeneratedReportForFinding(userId, findingId);

  if (!report) {
    throw reportNotFound();
  }

  return toGeneratedReport(report);
}

export async function exportUserReport(userId: string, reportId: string) {
  const report = await findGeneratedReportById(userId, reportId);

  if (!report) {
    throw reportNotFound();
  }

  const finding = await findFindingById(userId, report.findingId);

  if (!finding) {
    throw findingNotFound();
  }

  return {
    filename: createReportFilename(finding.title),
    content: report.contentMarkdown,
  };
}
