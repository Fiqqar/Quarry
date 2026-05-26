import { REDACTED_VALUE } from "@quarry/shared";
import { AppError } from "../errors/app-error";
import {
  mergeRedactedFields,
  redactAllRecordValues,
  redactBody,
  redactKeyValueRecord,
  redactPlainText,
  redactUrl,
} from "./redact";

export type ParsedHttpRequest = {
  method: string;
  path: string;
  host: string | null;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  cookies: Record<string, string>;
  body: string | null;
};

export type ParsedHttpResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string | null;
};

export type ParsedHttpArtifact = {
  rawInput: string;
  parsedMethod: string | null;
  parsedUrl: string | null;
  parsedHeaders: Record<string, string> | null;
  parsedBody: string | null;
  responseStatus: number | null;
  responseHeaders: Record<string, string> | null;
  responseBody: string | null;
  redactedOutput: string;
  redactedFields: string[];
  request: ParsedHttpRequest | null;
  response: ParsedHttpResponse | null;
};

type ParseInput = {
  rawRequest?: string | null;
  rawResponse?: string | null;
  notes?: string | null;
};

const REQUEST_LINE_PATTERN = /^([A-Z]+)\s+(\S+)\s+HTTP\/\d(?:\.\d)?$/i;
const RESPONSE_LINE_PATTERN = /^HTTP\/\d(?:\.\d)?\s+(\d{3})(?:\s+.*)?$/i;

function parseError(message: string) {
  return new AppError({
    code: "HTTP_PARSE_ERROR",
    message,
    statusCode: 400,
  });
}

function normalizeNewlines(raw: string) {
  return raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function splitHeadAndBody(raw: string) {
  const normalized = normalizeNewlines(raw).trimEnd();
  const separatorIndex = normalized.indexOf("\n\n");

  if (separatorIndex === -1) {
    return {
      head: normalized,
      body: null,
    };
  }

  return {
    head: normalized.slice(0, separatorIndex),
    body: normalized.slice(separatorIndex + 2),
  };
}

function parseHeaders(lines: string[], namespace: string) {
  const headers: Record<string, string> = {};

  for (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }

    const separatorIndex = line.indexOf(":");

    if (separatorIndex <= 0) {
      throw parseError(`Malformed ${namespace} header.`);
    }

    const name = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    headers[name] = value;
  }

  return headers;
}

function getHeader(headers: Record<string, string>, name: string) {
  const target = name.toLowerCase();
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === target);

  return entry?.[1] ?? null;
}

function parseQueryParams(path: string) {
  try {
    const url = new URL(path, "http://placeholder.local");
    const params: Record<string, string> = {};

    for (const [key, value] of url.searchParams.entries()) {
      params[key] = value;
    }

    return params;
  } catch {
    return {};
  }
}

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) {
    return {};
  }

  const cookies: Record<string, string> = {};

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    const name = rawName?.trim();

    if (!name) {
      continue;
    }

    cookies[name] = rawValue.join("=").trim();
  }

  return cookies;
}

function renderHeaders(headers: Record<string, string>) {
  return Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function renderRequest(request: ParsedHttpRequest) {
  const lines = [`${request.method} ${request.path} HTTP/1.1`];
  const renderedHeaders = renderHeaders(request.headers);

  if (renderedHeaders.length > 0) {
    lines.push(renderedHeaders);
  }

  lines.push("");

  if (request.body) {
    lines.push(request.body);
  }

  return lines.join("\n");
}

function renderResponse(response: ParsedHttpResponse) {
  const lines = [`HTTP/1.1 ${response.statusCode}`];
  const renderedHeaders = renderHeaders(response.headers);

  if (renderedHeaders.length > 0) {
    lines.push(renderedHeaders);
  }

  lines.push("");

  if (response.body) {
    lines.push(response.body);
  }

  return lines.join("\n");
}

function redactRequest(request: ParsedHttpRequest): {
  request: ParsedHttpRequest;
  redactedFields: string[];
} {
  const redactedUrl = redactUrl(request.path, "request.query");
  const redactedHeaders = redactKeyValueRecord(request.headers, "request.headers");
  const cookieHeader = getHeader(request.headers, "cookie");
  const redactedCookies = cookieHeader
    ? redactAllRecordValues(request.cookies, "request.cookies")
    : { value: request.cookies, redactedFields: [] };
  const redactedQueryParams = redactKeyValueRecord(parseQueryParams(redactedUrl.value), "request.query");
  const redactedBody = redactBody(
    request.body,
    getHeader(request.headers, "content-type"),
    "request.body",
  );

  return {
    request: {
      ...request,
      path: redactedUrl.value,
      headers: redactedHeaders.value,
      queryParams: redactedQueryParams.value,
      cookies: redactedCookies.value,
      body: redactedBody.value,
    },
    redactedFields: mergeRedactedFields(
      redactedUrl.redactedFields,
      redactedHeaders.redactedFields,
      redactedCookies.redactedFields,
      redactedQueryParams.redactedFields,
      redactedBody.redactedFields,
    ),
  };
}

function redactResponse(response: ParsedHttpResponse): {
  response: ParsedHttpResponse;
  redactedFields: string[];
} {
  const redactedHeaders = redactKeyValueRecord(response.headers, "response.headers");
  const redactedBody = redactBody(
    response.body,
    getHeader(response.headers, "content-type"),
    "response.body",
  );

  return {
    response: {
      ...response,
      headers: redactedHeaders.value,
      body: redactedBody.value,
    },
    redactedFields: mergeRedactedFields(
      redactedHeaders.redactedFields,
      redactedBody.redactedFields,
    ),
  };
}

export function parseRawHttpRequest(rawRequest: string): ParsedHttpRequest {
  const { head, body } = splitHeadAndBody(rawRequest);
  const lines = head.split("\n");
  const requestLine = lines.shift()?.trim();

  if (!requestLine) {
    throw parseError("Raw HTTP request is empty.");
  }

  const match = REQUEST_LINE_PATTERN.exec(requestLine);

  if (!match) {
    throw parseError("Malformed HTTP request line.");
  }

  const [, method, path] = match;
  const headers = parseHeaders(lines, "request");
  const host = getHeader(headers, "host");

  return {
    method: method.toUpperCase(),
    path,
    host,
    headers,
    queryParams: parseQueryParams(path),
    cookies: parseCookies(getHeader(headers, "cookie")),
    body,
  };
}

export function parseRawHttpResponse(rawResponse: string): ParsedHttpResponse {
  const { head, body } = splitHeadAndBody(rawResponse);
  const lines = head.split("\n");
  const statusLine = lines.shift()?.trim();

  if (!statusLine) {
    throw parseError("Raw HTTP response is empty.");
  }

  const match = RESPONSE_LINE_PATTERN.exec(statusLine);

  if (!match) {
    throw parseError("Malformed HTTP response line.");
  }

  const statusCode = Number(match[1]);

  return {
    statusCode,
    headers: parseHeaders(lines, "response"),
    body,
  };
}

export function parseAndRedactHttpArtifact(input: ParseInput): ParsedHttpArtifact {
  const request = input.rawRequest?.trim()
    ? parseRawHttpRequest(input.rawRequest)
    : null;
  const response = input.rawResponse?.trim()
    ? parseRawHttpResponse(input.rawResponse)
    : null;

  if (!request && !response) {
    throw parseError("rawRequest or rawResponse is required.");
  }

  const redactedRequest = request ? redactRequest(request) : null;
  const redactedResponse = response ? redactResponse(response) : null;
  const redactedNotes = input.notes?.trim()
    ? redactPlainText(input.notes.trim(), "notes")
    : { value: null, redactedFields: [] };
  const redactedFields = mergeRedactedFields(
    redactedRequest?.redactedFields ?? [],
    redactedResponse?.redactedFields ?? [],
    redactedNotes.redactedFields,
  );
  const rawInput = [
    redactedRequest ? renderRequest(redactedRequest.request) : null,
    redactedResponse ? renderResponse(redactedResponse.response) : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const redactedOutput = JSON.stringify(
    {
      request: redactedRequest?.request ?? null,
      response: redactedResponse?.response ?? null,
      notes: redactedNotes.value,
      redaction: {
        value: REDACTED_VALUE,
        fields: redactedFields,
      },
    },
    null,
    2,
  );

  return {
    rawInput,
    parsedMethod: redactedRequest?.request.method ?? null,
    parsedUrl: redactedRequest?.request.path ?? null,
    parsedHeaders: redactedRequest?.request.headers ?? null,
    parsedBody: redactedRequest?.request.body ?? null,
    responseStatus: redactedResponse?.response.statusCode ?? null,
    responseHeaders: redactedResponse?.response.headers ?? null,
    responseBody: redactedResponse?.response.body ?? null,
    redactedOutput,
    redactedFields,
    request: redactedRequest?.request ?? null,
    response: redactedResponse?.response ?? null,
  };
}
