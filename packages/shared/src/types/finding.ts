import type { Priority } from "../constants/priority";
import type { Severity } from "../constants/severity";
import type { FindingStatus } from "../constants/status";
import type { HttpArtifact } from "./http-artifact";

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

export type FindingDetail = Finding & {
  httpArtifacts: HttpArtifact[];
};

export type CreateFindingInput = {
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

export type UpdateFindingInput = Partial<CreateFindingInput>;

