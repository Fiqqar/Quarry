import { and, count, db, desc, eq, findings, ilike, or, type Database } from "@quarry/db";
import type { CreateFindingData, ListFindingsQuery, UpdateFindingData } from "./finding.schema";

export type FindingRow = typeof findings.$inferSelect;

type FindingListFilters = ListFindingsQuery & {
  userId: string;
};

function buildFindingListWhere({
  userId,
  programId,
  severity,
  status,
  search,
}: Pick<FindingListFilters, "userId" | "programId" | "severity" | "status" | "search">) {
  const conditions = [eq(findings.userId, userId)];

  if (programId) {
    conditions.push(eq(findings.programId, programId));
  }

  if (severity) {
    conditions.push(eq(findings.severity, severity));
  }

  if (status) {
    conditions.push(eq(findings.status, status));
  }

  if (search) {
    const pattern = `%${search}%`;
    const searchCondition = or(
      ilike(findings.title, pattern),
      ilike(findings.weakness, pattern),
      ilike(findings.affectedUrl, pattern),
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  return and(...conditions);
}

export async function listFindings(
  filters: FindingListFilters,
  database: Database = db,
): Promise<{ findings: FindingRow[]; total: number }> {
  const where = buildFindingListWhere(filters);
  const offset = (filters.page - 1) * filters.limit;

  const rows = await database
    .select()
    .from(findings)
    .where(where)
    .orderBy(desc(findings.createdAt))
    .limit(filters.limit)
    .offset(offset);

  const [totalRow] = await database.select({ total: count() }).from(findings).where(where);

  return {
    findings: rows,
    total: totalRow?.total ?? 0,
  };
}

export async function findFindingById(
  userId: string,
  findingId: string,
  database: Database = db,
): Promise<FindingRow | undefined> {
  return database.query.findings.findFirst({
    where: and(eq(findings.id, findingId), eq(findings.userId, userId)),
  });
}

export async function createFinding(
  userId: string,
  input: CreateFindingData,
  database: Database = db,
): Promise<FindingRow> {
  const [createdFinding] = await database
    .insert(findings)
    .values({
      userId,
      ...input,
    })
    .returning();

  return createdFinding;
}

export async function updateFinding(
  userId: string,
  findingId: string,
  input: UpdateFindingData,
  database: Database = db,
): Promise<FindingRow | undefined> {
  const [updatedFinding] = await database
    .update(findings)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(and(eq(findings.id, findingId), eq(findings.userId, userId)))
    .returning();

  return updatedFinding;
}

export async function deleteFinding(
  userId: string,
  findingId: string,
  database: Database = db,
): Promise<boolean> {
  const [deletedFinding] = await database
    .delete(findings)
    .where(and(eq(findings.id, findingId), eq(findings.userId, userId)))
    .returning({ id: findings.id });

  return Boolean(deletedFinding);
}
