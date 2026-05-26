import { and, db, desc, eq, generatedReports, type Database } from "@quarry/db";

export type GeneratedReportRow = typeof generatedReports.$inferSelect;

type CreateGeneratedReportRecord = {
  userId: string;
  findingId: string;
  templateId: string | null;
  contentMarkdown: string;
};

export async function createGeneratedReport(
  input: CreateGeneratedReportRecord,
  database: Database = db,
): Promise<GeneratedReportRow> {
  const [report] = await database.insert(generatedReports).values(input).returning();

  return report;
}

export async function findLatestGeneratedReportForFinding(
  userId: string,
  findingId: string,
  database: Database = db,
): Promise<GeneratedReportRow | undefined> {
  return database.query.generatedReports.findFirst({
    where: and(eq(generatedReports.findingId, findingId), eq(generatedReports.userId, userId)),
    orderBy: desc(generatedReports.createdAt),
  });
}

export async function findGeneratedReportById(
  userId: string,
  reportId: string,
  database: Database = db,
): Promise<GeneratedReportRow | undefined> {
  return database.query.generatedReports.findFirst({
    where: and(eq(generatedReports.id, reportId), eq(generatedReports.userId, userId)),
  });
}
