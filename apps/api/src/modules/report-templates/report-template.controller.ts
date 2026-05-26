import { success } from "../../common/response/success";
import { parseReportTemplateId } from "./report-template.schema";
import { getUserReportTemplate, listUserReportTemplates } from "./report-template.service";

type CurrentUser = {
  id: string;
};

export async function listReportTemplatesController(currentUser: CurrentUser) {
  const templates = await listUserReportTemplates(currentUser.id);

  return success(templates);
}

export async function getReportTemplateController(currentUser: CurrentUser, templateId: string) {
  const parsedTemplateId = parseReportTemplateId(templateId);
  const template = await getUserReportTemplate(currentUser.id, parsedTemplateId);

  return success(template);
}
