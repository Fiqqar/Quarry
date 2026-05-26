import { and, count, db, desc, eq, httpArtifacts, type Database } from "@quarry/db";
import type { HttpArtifactType } from "@quarry/shared";
import type { ParsedHttpArtifact } from "../../common/utils/http-parser";

export type HttpArtifactRow = typeof httpArtifacts.$inferSelect;

type HttpArtifactListFilters = {
  userId: string;
  findingId: string | null;
  page: number;
  limit: number;
};

type CreateHttpArtifactRecord = ParsedHttpArtifact & {
  userId: string;
  findingId: string;
  type: HttpArtifactType;
};

function buildHttpArtifactListWhere({
  userId,
  findingId,
}: Pick<HttpArtifactListFilters, "userId" | "findingId">) {
  const conditions = [eq(httpArtifacts.userId, userId)];

  if (findingId) {
    conditions.push(eq(httpArtifacts.findingId, findingId));
  }

  return and(...conditions);
}

export async function listHttpArtifacts(
  filters: HttpArtifactListFilters,
  database: Database = db,
): Promise<{ artifacts: HttpArtifactRow[]; total: number }> {
  const where = buildHttpArtifactListWhere(filters);
  const offset = (filters.page - 1) * filters.limit;

  const rows = await database
    .select()
    .from(httpArtifacts)
    .where(where)
    .orderBy(desc(httpArtifacts.createdAt))
    .limit(filters.limit)
    .offset(offset);

  const [totalRow] = await database.select({ total: count() }).from(httpArtifacts).where(where);

  return {
    artifacts: rows,
    total: totalRow?.total ?? 0,
  };
}

export async function findHttpArtifactById(
  userId: string,
  artifactId: string,
  database: Database = db,
): Promise<HttpArtifactRow | undefined> {
  return database.query.httpArtifacts.findFirst({
    where: and(eq(httpArtifacts.id, artifactId), eq(httpArtifacts.userId, userId)),
  });
}

export async function createHttpArtifact(
  input: CreateHttpArtifactRecord,
  database: Database = db,
): Promise<HttpArtifactRow> {
  const [createdArtifact] = await database
    .insert(httpArtifacts)
    .values({
      userId: input.userId,
      findingId: input.findingId,
      type: input.type,
      rawInput: input.rawInput,
      parsedMethod: input.parsedMethod,
      parsedUrl: input.parsedUrl,
      parsedHeaders: input.parsedHeaders,
      parsedBody: input.parsedBody,
      responseStatus: input.responseStatus,
      responseHeaders: input.responseHeaders,
      responseBody: input.responseBody,
      redactedOutput: input.redactedOutput,
      redactedFields: input.redactedFields,
    })
    .returning();

  return createdArtifact;
}

export async function deleteHttpArtifact(
  userId: string,
  artifactId: string,
  database: Database = db,
): Promise<boolean> {
  const [deletedArtifact] = await database
    .delete(httpArtifacts)
    .where(and(eq(httpArtifacts.id, artifactId), eq(httpArtifacts.userId, userId)))
    .returning({ id: httpArtifacts.id });

  return Boolean(deletedArtifact);
}
