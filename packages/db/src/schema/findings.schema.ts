import { foreignKey, index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { programs } from "./programs.schema";
import { users } from "./auth.schema";

export const findings = pgTable(
  "findings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    programId: uuid("program_id").notNull(),
    title: text("title").notNull(),
    severity: text("severity").notNull(),
    priority: text("priority"),
    status: text("status").notNull().default("draft"),
    weakness: text("weakness"),
    affectedUrl: text("affected_url"),
    affectedMethod: text("affected_method"),
    rootCause: text("root_cause"),
    impact: text("impact"),
    stepsToReproduce: text("steps_to_reproduce"),
    remediation: text("remediation"),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("findings_user_id_idx").on(table.userId),
    userProgramIdx: index("findings_user_id_program_id_idx").on(table.userId, table.programId),
    userSeverityIdx: index("findings_user_id_severity_idx").on(table.userId, table.severity),
    userStatusIdx: index("findings_user_id_status_idx").on(table.userId, table.status),
    userCreatedAtIdx: index("findings_user_id_created_at_idx").on(table.userId, table.createdAt),
    userOwnedUnique: unique("findings_id_user_id_unique").on(table.id, table.userId),
    programUserFk: foreignKey({
      columns: [table.programId, table.userId],
      foreignColumns: [programs.id, programs.userId],
      name: "findings_program_id_user_id_programs_fk",
    }).onDelete("cascade"),
  }),
);
