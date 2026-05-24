export type ReportTemplate = {
  id: string;
  name: string;
  weakness: string | null;
  contentMarkdown: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReportTemplateListItem = Pick<
  ReportTemplate,
  "id" | "name" | "weakness" | "isDefault"
>;

export type GeneratedReport = {
  id: string;
  findingId: string;
  templateId: string | null;
  contentMarkdown: string;
  createdAt: string;
  updatedAt: string;
};

