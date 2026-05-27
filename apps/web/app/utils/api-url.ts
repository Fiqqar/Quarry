const LOCAL_API_BASE_URL = "http://localhost:3001/api/v1";

function normalizeApiBaseUrl(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return LOCAL_API_BASE_URL;
  }

  try {
    const url = new URL(value.trim());

    return url.toString().replace(/\/$/, "");
  } catch {
    return LOCAL_API_BASE_URL;
  }
}

export function getApiBaseUrl() {
  const config = useRuntimeConfig();

  return normalizeApiBaseUrl(config.public.apiBaseUrl);
}

export function resolveApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getApiBaseUrl()}${normalizedPath}`;
}
