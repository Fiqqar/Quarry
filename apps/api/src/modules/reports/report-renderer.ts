import { redactPlainText } from "../../common/utils/redact";
import type { FindingRow } from "../findings/finding.repository";
import type { HttpArtifactRow } from "../http-artifacts/http-artifact.repository";
import type { ProgramRow } from "../programs/program.repository";
import type { ReportTemplateRow } from "../report-templates/report-template.repository";

type RenderReportInput = {
  finding: FindingRow;
  program: ProgramRow | null;
  template: ReportTemplateRow;
  artifacts: HttpArtifactRow[];
};

const DEFAULT_SECTIONS = [
  "Summary",
  "Affected Asset",
  "Severity",
  "Root Cause",
  "Impact",
  "Steps to Reproduce",
  "Evidence",
  "Remediation",
] as const;

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function safeText(value: string | null | undefined, fallback = "Not provided.") {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  return escapeHtml(trimmed);
}

function safeCode(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/~~~+/g, "~~ ~");
}

function codeBlock(value: string, language = "http") {
  return `~~~${language}\n${safeCode(value)}\n~~~`;
}

function safeEvidence(value: string, namespace: string) {
  return redactPlainText(value, namespace).value;
}

function extractTemplateSections(templateMarkdown: string) {
  const sections = templateMarkdown
    .split("\n")
    .map((line) => /^##\s+(.+?)\s*$/.exec(line)?.[1]?.trim())
    .filter((section): section is string => Boolean(section));

  const merged = [...sections, ...DEFAULT_SECTIONS];

  return Array.from(new Set(merged));
}

function renderAffectedAsset({ finding, program }: Pick<RenderReportInput, "finding" | "program">) {
  return [
    `- Program: ${safeText(program?.name, "Not linked.")}`,
    `- Platform: ${safeText(program?.platform)}`,
    `- Program URL: ${safeText(program?.programUrl)}`,
    `- Affected URL: ${safeText(finding.affectedUrl)}`,
    `- Affected Method: ${safeText(finding.affectedMethod)}`,
  ].join("\n");
}

function renderEvidence(artifacts: HttpArtifactRow[]) {
  if (artifacts.length === 0) {
    return "No HTTP evidence saved yet.";
  }

  return artifacts
    .map((artifact, index) => {
      const evidenceSource =
        artifact.redactedOutput ?? artifact.rawInput ?? "No redacted evidence available.";
      const evidence = safeEvidence(evidenceSource, `report.evidence.${index + 1}`);
      const redactedFields =
        artifact.redactedFields.length > 0
          ? artifact.redactedFields.map((field) => `\`${safeText(field)}\``).join(", ")
          : "None";

      return [
        `### Evidence ${index + 1}`,
        "",
        `- Type: ${safeText(artifact.type)}`,
        `- Redacted fields: ${redactedFields}`,
        "",
        codeBlock(evidence),
      ].join("\n");
    })
    .join("\n\n");
}

function renderSection(section: string, input: RenderReportInput) {
  const normalized = section.toLowerCase();

  if (normalized === "summary") {
    return safeText(
      `${input.finding.title}${input.finding.weakness ? ` (${input.finding.weakness})` : ""}`,
    );
  }

  if (normalized === "affected asset") {
    return renderAffectedAsset(input);
  }

  if (normalized === "severity") {
    return [
      `- Severity: ${safeText(input.finding.severity)}`,
      `- Priority: ${safeText(input.finding.priority)}`,
    ].join("\n");
  }

  if (normalized === "root cause") {
    return safeText(input.finding.rootCause);
  }

  if (normalized === "impact") {
    return safeText(input.finding.impact);
  }

  if (normalized === "steps to reproduce") {
    return safeText(input.finding.stepsToReproduce);
  }

  if (normalized === "evidence") {
    return renderEvidence(input.artifacts);
  }

  if (normalized === "remediation") {
    return safeText(input.finding.remediation);
  }

  return "Not provided.";
}

export function renderMarkdownReport(input: RenderReportInput) {
  const sections = extractTemplateSections(input.template.contentMarkdown);
  const title = safeText(input.finding.title, "Untitled finding");
  const body = sections
    .map((section) => [`## ${safeText(section)}`, "", renderSection(section, input)].join("\n"))
    .join("\n\n");

  return [`# ${title}`, "", body].join("\n");
}

export function createReportFilename(findingTitle: string) {
  const slug = findingTitle
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${slug || "quarry-report"}.md`;
}
