import { foreignKey, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { findings } from "./findings.schema";
import { reportTemplates } from "./report-templates.schema";
import { users } from "./auth.schema";

export const generatedReports = pgTable(
  "generated_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    findingId: uuid("finding_id").notNull(),
    templateId: uuid("template_id").references(() => reportTemplates.id, { onDelete: "set null" }),
    contentMarkdown: text("content_markdown").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("generated_reports_user_id_idx").on(table.userId),
    userFindingIdx: index("generated_reports_user_id_finding_id_idx").on(
      table.userId,
      table.findingId,
    ),
    findingUserFk: foreignKey({
      columns: [table.findingId, table.userId],
      foreignColumns: [findings.id, findings.userId],
      name: "generated_reports_finding_id_user_id_findings_fk",
    }).onDelete("cascade"),
  }),
);
