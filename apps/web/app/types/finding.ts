import type { PaginationMeta } from "./program";

export type { PaginationMeta } from "./program";

export const SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;
export const PRIORITIES = ["p5", "p4", "p3", "p2", "p1"] as const;
export const FINDING_STATUSES = [
  "draft",
  "ready",
  "reported",
  "accepted",
  "rejected",
  "duplicate",
  "fixed",
] as const;
export const WEAKNESSES = [
  "IDOR / Broken Object Level Authorization",
  "Broken Function Level Authorization",
  "Authentication Bypass",
  "Stored XSS",
  "Reflected XSS",
  "SQL Injection",
  "SSRF",
  "Information Disclosure",
  "Race Condition",
  "Business Logic Flaw",
  "Missing Rate Limit",
  "Account Takeover",
  "Open Redirect",
  "CSRF",
  "File Upload Vulnerability",
  "Mass Assignment",
] as const;

export type Severity = (typeof SEVERITIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type FindingStatus = (typeof FINDING_STATUSES)[number];

export type Finding = {
  id: string;
  programId: string;
  title: string;
  severity: Severity;
  priority: Priority | null;
  status: FindingStatus;
  weakness: string | null;
  affectedUrl: string | null;
  affectedMethod: string | null;
  rootCause: string | null;
  impact: string | null;
  stepsToReproduce: string | null;
  remediation: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FindingInput = {
  programId: string;
  title: string;
  severity: Severity;
  priority?: Priority | null;
  status?: FindingStatus;
  weakness?: string | null;
  affectedUrl?: string | null;
  affectedMethod?: string | null;
  rootCause?: string | null;
  impact?: string | null;
  stepsToReproduce?: string | null;
  remediation?: string | null;
  internalNotes?: string | null;
};

export type FindingListQuery = {
  programId?: string | null;
  severity?: Severity | null;
  status?: FindingStatus | null;
  search?: string | null;
  page?: number;
  limit?: number;
};

export type FindingListResult = {
  data: Finding[];
  meta?: PaginationMeta;
};
