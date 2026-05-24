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

export type CreateProgramInput = {
  name: string;
  platform?: string | null;
  programUrl?: string | null;
  scopeNotes?: string | null;
};

export type UpdateProgramInput = Partial<CreateProgramInput>;

