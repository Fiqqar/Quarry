import { Elysia } from "elysia";
import { requireAuth } from "../../common/guards/require-auth";
import {
  exportReportController,
  generateReportController,
  getLatestReportController,
} from "./report.controller";

export const reportRoutes = new Elysia({ name: "report-routes" })
  .use(requireAuth)
  .post("/findings/:findingId/reports/generate", ({ currentUser, params, body, set }) => {
    set.status = 201;

    return generateReportController(currentUser, params.findingId, body);
  })
  .get("/findings/:findingId/reports/latest", ({ currentUser, params }) =>
    getLatestReportController(currentUser, params.findingId),
  )
  .get("/reports/:reportId/export", ({ currentUser, params }) =>
    exportReportController(currentUser, params.reportId),
  );
