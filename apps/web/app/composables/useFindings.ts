import type { Finding, FindingInput, FindingListQuery, PaginationMeta } from "~/types/finding";

function compactQuery(query: FindingListQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

export function useFindings() {
  const api = useApi();

  return {
    listFindings: (query: FindingListQuery = {}) =>
      api.get<Finding[], PaginationMeta>("/findings", compactQuery(query)),
    createFinding: (input: FindingInput) => api.post<Finding>("/findings", input),
    getFinding: (findingId: string) => api.get<Finding>(`/findings/${findingId}`),
    updateFinding: (findingId: string, input: Partial<FindingInput>) =>
      api.patch<Finding>(`/findings/${findingId}`, input),
    deleteFinding: (findingId: string) => api.delete<{ deleted: boolean }>(`/findings/${findingId}`),
  };
}
