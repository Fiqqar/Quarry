import { Elysia } from "elysia";
import { requireAuth } from "../../common/guards/require-auth";
import {
  getReportTemplateController,
  listReportTemplatesController,
} from "./report-template.controller";

export const reportTemplateRoutes = new Elysia({ prefix: "/report-templates" })
  .use(requireAuth)
  .get("/", ({ currentUser }) => listReportTemplatesController(currentUser))
  .get("/:templateId", ({ currentUser, params }) =>
    getReportTemplateController(currentUser, params.templateId),
  );
