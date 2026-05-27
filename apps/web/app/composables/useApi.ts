import type { FetchOptions } from "ofetch";
import type { ApiEnvelope, ApiResult } from "~/types/api";
import { ApiClientError } from "~/utils/api-error";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
type ApiRequestBody = BodyInit | Record<string, unknown> | null;
const API_TIMEOUT_MS = 8_000;

type ApiRequestOptions = {
  method?: HttpMethod;
  body?: ApiRequestBody;
  query?: Record<string, unknown>;
  headers?: HeadersInit;
};

function resolveApiUrl(baseUrl: string, path: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

export function useApi() {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const serverHeaders = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

  async function request<TData, TMeta = unknown>(
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResult<TData, TMeta>> {
    const response = await $fetch.raw<ApiEnvelope<TData, TMeta>>(resolveApiUrl(apiBaseUrl, path), {
      body: options.body,
      credentials: "include",
      headers: {
        ...serverHeaders,
        ...options.headers,
      },
      ignoreResponseError: true,
      method: options.method ?? "GET",
      query: options.query,
      timeout: API_TIMEOUT_MS,
    } satisfies FetchOptions);
    const envelope = response._data;

    if (!envelope || typeof envelope !== "object" || !("success" in envelope)) {
      throw new ApiClientError("Unexpected API response.", "UNEXPECTED_API_RESPONSE", response.status);
    }

    if (!envelope.success) {
      throw new ApiClientError(envelope.error.message, envelope.error.code, response.status);
    }

    return {
      data: envelope.data,
      meta: envelope.meta,
    };
  }

  return {
    request,
    get: <TData, TMeta = unknown>(path: string, query?: Record<string, unknown>) =>
      request<TData, TMeta>(path, { query }),
    post: <TData>(path: string, body?: ApiRequestBody) =>
      request<TData>(path, { body, method: "POST" }),
    patch: <TData>(path: string, body?: ApiRequestBody) =>
      request<TData>(path, { body, method: "PATCH" }),
    delete: <TData>(path: string) => request<TData>(path, { method: "DELETE" }),
  };
}
