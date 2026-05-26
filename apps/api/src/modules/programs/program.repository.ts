import { and, count, db, desc, eq, findings, ilike, or, programs, type Database } from "@quarry/db";
import type { CreateProgramData, ListProgramsQuery, UpdateProgramData } from "./program.schema";

export type ProgramRow = typeof programs.$inferSelect;

export type ProgramListRow = ProgramRow & {
  findingCount: number;
};

type ProgramListFilters = ListProgramsQuery & {
  userId: string;
};

function buildProgramListWhere({ userId, search }: Pick<ProgramListFilters, "userId" | "search">) {
  const conditions = [eq(programs.userId, userId)];

  if (search) {
    const pattern = `%${search}%`;
    const searchCondition = or(ilike(programs.name, pattern), ilike(programs.platform, pattern));

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  return and(...conditions);
}

export async function listPrograms(
  filters: ProgramListFilters,
  database: Database = db,
): Promise<{ programs: ProgramListRow[]; total: number }> {
  const where = buildProgramListWhere(filters);
  const offset = (filters.page - 1) * filters.limit;

  const rows = await database
    .select({
      id: programs.id,
      userId: programs.userId,
      name: programs.name,
      platform: programs.platform,
      programUrl: programs.programUrl,
      scopeNotes: programs.scopeNotes,
      createdAt: programs.createdAt,
      updatedAt: programs.updatedAt,
      findingCount: count(findings.id),
    })
    .from(programs)
    .leftJoin(
      findings,
      and(eq(findings.programId, programs.id), eq(findings.userId, filters.userId)),
    )
    .where(where)
    .groupBy(
      programs.id,
      programs.userId,
      programs.name,
      programs.platform,
      programs.programUrl,
      programs.scopeNotes,
      programs.createdAt,
      programs.updatedAt,
    )
    .orderBy(desc(programs.createdAt))
    .limit(filters.limit)
    .offset(offset);

  const [totalRow] = await database.select({ total: count() }).from(programs).where(where);

  return {
    programs: rows,
    total: totalRow?.total ?? 0,
  };
}

export async function findProgramById(
  userId: string,
  programId: string,
  database: Database = db,
): Promise<ProgramRow | undefined> {
  return database.query.programs.findFirst({
    where: and(eq(programs.id, programId), eq(programs.userId, userId)),
  });
}

export async function createProgram(
  userId: string,
  input: CreateProgramData,
  database: Database = db,
): Promise<ProgramRow> {
  const [createdProgram] = await database
    .insert(programs)
    .values({
      userId,
      ...input,
    })
    .returning();

  return createdProgram;
}

export async function updateProgram(
  userId: string,
  programId: string,
  input: UpdateProgramData,
  database: Database = db,
): Promise<ProgramRow | undefined> {
  const [updatedProgram] = await database
    .update(programs)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(and(eq(programs.id, programId), eq(programs.userId, userId)))
    .returning();

  return updatedProgram;
}

export async function deleteProgram(
  userId: string,
  programId: string,
  database: Database = db,
): Promise<boolean> {
  const [deletedProgram] = await database
    .delete(programs)
    .where(and(eq(programs.id, programId), eq(programs.userId, userId)))
    .returning({ id: programs.id });

  return Boolean(deletedProgram);
}
