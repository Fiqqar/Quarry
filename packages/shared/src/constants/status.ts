export const FINDING_STATUSES = [
  "draft",
  "ready",
  "reported",
  "accepted",
  "rejected",
  "duplicate",
  "fixed",
] as const;

export type FindingStatus = (typeof FINDING_STATUSES)[number];

