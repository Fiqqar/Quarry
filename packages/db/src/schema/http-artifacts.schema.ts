import { foreignKey, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { findings } from "./findings.schema";
import { users } from "./auth.schema";

export const httpArtifacts = pgTable(
  "http_artifacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    findingId: uuid("finding_id").notNull(),
    type: text("type").notNull(),
    rawInput: text("raw_input"),
    parsedMethod: text("parsed_method"),
    parsedUrl: text("parsed_url"),
    parsedHeaders: jsonb("parsed_headers").$type<Record<string, string> | null>(),
    parsedBody: text("parsed_body"),
    responseStatus: integer("response_status"),
    responseHeaders: jsonb("response_headers").$type<Record<string, string> | null>(),
    responseBody: text("response_body"),
    redactedOutput: text("redacted_output"),
    redactedFields: jsonb("redacted_fields").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("http_artifacts_user_id_idx").on(table.userId),
    userFindingIdx: index("http_artifacts_user_id_finding_id_idx").on(
      table.userId,
      table.findingId,
    ),
    findingUserFk: foreignKey({
      columns: [table.findingId, table.userId],
      foreignColumns: [findings.id, findings.userId],
      name: "http_artifacts_finding_id_user_id_findings_fk",
    }).onDelete("cascade"),
  }),
);
