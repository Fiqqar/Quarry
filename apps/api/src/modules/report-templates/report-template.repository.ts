import { and, db, desc, eq, isNull, or, reportTemplates, type Database } from "@quarry/db";

export type ReportTemplateRow = typeof reportTemplates.$inferSelect;

function accessibleTemplateWhere(userId: string) {
  return or(isNull(reportTemplates.userId), eq(reportTemplates.userId, userId));
}

export async function listAccessibleReportTemplates(
  userId: string,
  database: Database = db,
): Promise<ReportTemplateRow[]> {
  return database
    .select()
    .from(reportTemplates)
    .where(accessibleTemplateWhere(userId))
    .orderBy(desc(reportTemplates.isDefault), desc(reportTemplates.createdAt));
}

export async function findAccessibleReportTemplateById(
  userId: string,
  templateId: string,
  database: Database = db,
): Promise<ReportTemplateRow | undefined> {
  return database.query.reportTemplates.findFirst({
    where: and(eq(reportTemplates.id, templateId), accessibleTemplateWhere(userId)),
  });
}
