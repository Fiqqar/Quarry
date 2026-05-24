export const HTTP_ARTIFACT_TYPES = ["request", "response", "request_response_pair"] as const;

export type HttpArtifactType = (typeof HTTP_ARTIFACT_TYPES)[number];

export type HttpHeaders = Record<string, string>;

export type HttpArtifact = {
  id: string;
  findingId: string;
  type: HttpArtifactType;
  rawInput: string | null;
  parsedMethod: string | null;
  parsedUrl: string | null;
  parsedHeaders: HttpHeaders | null;
  parsedBody: string | null;
  responseStatus: number | null;
  responseHeaders: HttpHeaders | null;
  responseBody: string | null;
  redactedOutput: string | null;
  redactedFields: string[];
  createdAt: string;
  updatedAt: string;
};

export type ParsedHttpArtifact = Omit<HttpArtifact, "id" | "findingId" | "createdAt" | "updatedAt">;

