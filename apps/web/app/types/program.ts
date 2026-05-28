export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type Program = {
  id: string;
  name: string;
  platform: string | null;
  programUrl: string | null;
  scopeNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProgramListItem = Program & {
  findingCount: number;
};

export type ProgramInput = {
  name: string;
  platform?: string | null;
  programUrl?: string | null;
  scopeNotes?: string | null;
};

export type ProgramListQuery = {
  search?: string | null;
  page?: number;
  limit?: number;
};
