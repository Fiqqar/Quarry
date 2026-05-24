import { index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";

export const programs = pgTable(
  "programs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    platform: text("platform"),
    programUrl: text("program_url"),
    scopeNotes: text("scope_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("programs_user_id_idx").on(table.userId),
    userNameIdx: index("programs_user_id_name_idx").on(table.userId, table.name),
    userOwnedUnique: unique("programs_id_user_id_unique").on(table.id, table.userId),
  }),
);
