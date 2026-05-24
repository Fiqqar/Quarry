import { and, eq, isNull } from "drizzle-orm";
import { db, type Database } from "./client";
import { reportTemplates } from "./schema/report-templates.schema";

const DEFAULT_REPORT_STRUCTURE = `## Summary

## Affected Asset

## Severity

## Root Cause

## Impact

## Steps to Reproduce

## Evidence

## Remediation`;

export const DEFAULT_REPORT_TEMPLATES = [
  {
    name: "IDOR / Broken Object Level Authorization",
    weakness: "IDOR",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Broken Function Level Authorization",
    weakness: "Broken Function Level Authorization",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Authentication Bypass",
    weakness: "Authentication Bypass",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Stored XSS",
    weakness: "Stored XSS",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Reflected XSS",
    weakness: "Reflected XSS",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "SQL Injection",
    weakness: "SQL Injection",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "SSRF",
    weakness: "SSRF",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Information Disclosure",
    weakness: "Information Disclosure",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Race Condition",
    weakness: "Race Condition",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Business Logic Flaw",
    weakness: "Business Logic Flaw",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Missing Rate Limit",
    weakness: "Missing Rate Limit",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Account Takeover",
    weakness: "Account Takeover",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Open Redirect",
    weakness: "Open Redirect",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "CSRF",
    weakness: "CSRF",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "File Upload Vulnerability",
    weakness: "File Upload Vulnerability",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
  {
    name: "Mass Assignment",
    weakness: "Mass Assignment",
    contentMarkdown: DEFAULT_REPORT_STRUCTURE,
  },
] as const;

export async function seedDefaultReportTemplates(database: Database = db) {
  for (const template of DEFAULT_REPORT_TEMPLATES) {
    const existing = await database.query.reportTemplates.findFirst({
      where: and(
        isNull(reportTemplates.userId),
        eq(reportTemplates.isDefault, true),
        eq(reportTemplates.name, template.name),
      ),
    });

    if (existing) {
      continue;
    }

    await database.insert(reportTemplates).values({
      ...template,
      userId: null,
      isDefault: true,
    });
  }
}

