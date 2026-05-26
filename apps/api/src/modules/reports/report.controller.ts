import { success } from "../../common/response/success";
import { parseFindingId, parseGenerateReportBody, parseReportId } from "./report.schema";
import {
  exportUserReport,
  generateUserReport,
  getLatestUserReportForFinding,
} from "./report.service";

type CurrentUser = {
  id: string;
};

export async function generateReportController(
  currentUser: CurrentUser,
  findingId: string,
  body: unknown,
) {
  const parsedFindingId = parseFindingId(findingId);
  const input = parseGenerateReportBody(body);
  const report = await generateUserReport(currentUser.id, parsedFindingId, input.templateId);

  return success(report);
}

export async function getLatestReportController(currentUser: CurrentUser, findingId: string) {
  const parsedFindingId = parseFindingId(findingId);
  const report = await getLatestUserReportForFinding(currentUser.id, parsedFindingId);

  return success(report);
}

export async function exportReportController(currentUser: CurrentUser, reportId: string) {
  const parsedReportId = parseReportId(reportId);
  const reportExport = await exportUserReport(currentUser.id, parsedReportId);

  return success(reportExport);
}
