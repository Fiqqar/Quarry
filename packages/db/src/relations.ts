import { relations } from "drizzle-orm";
import { findings } from "./schema/findings.schema";
import { generatedReports } from "./schema/generated-reports.schema";
import { httpArtifacts } from "./schema/http-artifacts.schema";
import { programs } from "./schema/programs.schema";
import { reportTemplates } from "./schema/report-templates.schema";
import { accounts, sessions, users } from "./schema/auth.schema";

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  programs: many(programs),
  findings: many(findings),
  httpArtifacts: many(httpArtifacts),
  reportTemplates: many(reportTemplates),
  generatedReports: many(generatedReports),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const programsRelations = relations(programs, ({ one, many }) => ({
  user: one(users, {
    fields: [programs.userId],
    references: [users.id],
  }),
  findings: many(findings),
}));

export const findingsRelations = relations(findings, ({ one, many }) => ({
  user: one(users, {
    fields: [findings.userId],
    references: [users.id],
  }),
  program: one(programs, {
    fields: [findings.programId],
    references: [programs.id],
  }),
  httpArtifacts: many(httpArtifacts),
  generatedReports: many(generatedReports),
}));

export const httpArtifactsRelations = relations(httpArtifacts, ({ one }) => ({
  user: one(users, {
    fields: [httpArtifacts.userId],
    references: [users.id],
  }),
  finding: one(findings, {
    fields: [httpArtifacts.findingId],
    references: [findings.id],
  }),
}));

export const reportTemplatesRelations = relations(reportTemplates, ({ one, many }) => ({
  user: one(users, {
    fields: [reportTemplates.userId],
    references: [users.id],
  }),
  generatedReports: many(generatedReports),
}));

export const generatedReportsRelations = relations(generatedReports, ({ one }) => ({
  user: one(users, {
    fields: [generatedReports.userId],
    references: [users.id],
  }),
  finding: one(findings, {
    fields: [generatedReports.findingId],
    references: [findings.id],
  }),
  template: one(reportTemplates, {
    fields: [generatedReports.templateId],
    references: [reportTemplates.id],
  }),
}));
