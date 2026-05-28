import type { PaginationMeta, Program, ProgramInput, ProgramListItem, ProgramListQuery } from "~/types/program";

function compactQuery(query: ProgramListQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

export function usePrograms() {
  const api = useApi();

  return {
    listPrograms: (query: ProgramListQuery = {}) =>
      api.get<ProgramListItem[], PaginationMeta>("/programs", compactQuery(query)),
    createProgram: (input: ProgramInput) => api.post<Program>("/programs", input),
    getProgram: (programId: string) => api.get<Program>(`/programs/${programId}`),
    updateProgram: (programId: string, input: Partial<ProgramInput>) =>
      api.patch<Program>(`/programs/${programId}`, input),
    deleteProgram: (programId: string) => api.delete<{ deleted: boolean }>(`/programs/${programId}`),
  };
}
