import { REDACTED_VALUE, SENSITIVE_FIELDS } from "@quarry/shared";

type RedactionResult<TValue> = {
  value: TValue;
  redactedFields: string[];
};

const SENSITIVE_FIELD_SET = new Set(
  SENSITIVE_FIELDS.flatMap((field) => {
    const normalized = normalizeKey(field);

    return [field.toLowerCase(), normalized];
  }),
);

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replaceAll("-", "_");
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

export function isSensitiveKey(key: string) {
  const normalized = normalizeKey(key);

  if (SENSITIVE_FIELD_SET.has(normalized)) {
    return true;
  }

  return (
    normalized.includes("token") ||
    normalized.includes("secret") ||
    normalized.includes("password") ||
    normalized.includes("passwd") ||
    normalized.includes("session") ||
    normalized.includes("jwt")
  );
}

export function redactKeyValueRecord(
  record: Record<string, string>,
  namespace: string,
): RedactionResult<Record<string, string>> {
  const redactedFields: string[] = [];
  const value: Record<string, string> = {};

  for (const [key, fieldValue] of Object.entries(record)) {
    if (isSensitiveKey(key)) {
      value[key] = REDACTED_VALUE;
      redactedFields.push(`${namespace}.${key}`);
      continue;
    }

    value[key] = fieldValue;
  }

  return {
    value,
    redactedFields,
  };
}

export function redactAllRecordValues(
  record: Record<string, string>,
  namespace: string,
): RedactionResult<Record<string, string>> {
  const redactedFields: string[] = [];
  const value: Record<string, string> = {};

  for (const key of Object.keys(record)) {
    value[key] = REDACTED_VALUE;
    redactedFields.push(`${namespace}.${key}`);
  }

  return {
    value,
    redactedFields,
  };
}

function redactJsonValue(value: unknown, path: string, redactedFields: string[]): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => redactJsonValue(item, `${path}[${index}]`, redactedFields));
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  const output: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    const fieldPath = `${path}.${key}`;

    if (isSensitiveKey(key)) {
      output[key] = REDACTED_VALUE;
      redactedFields.push(fieldPath);
      continue;
    }

    output[key] = redactJsonValue(nestedValue, fieldPath, redactedFields);
  }

  return output;
}

function redactJsonBody(body: string, namespace: string): RedactionResult<string> | null {
  try {
    const parsed = JSON.parse(body) as unknown;
    const redactedFields: string[] = [];
    const redacted = redactJsonValue(parsed, namespace, redactedFields);

    return {
      value: JSON.stringify(redacted, null, 2),
      redactedFields,
    };
  } catch {
    return null;
  }
}

function redactFormBody(body: string, namespace: string): RedactionResult<string> {
  const redactedFields: string[] = [];
  const value = body
    .split("&")
    .map((part) => {
      if (part.length === 0) {
        return part;
      }

      const [rawKey, ...rawValue] = part.split("=");
      const key = safeDecodeURIComponent(rawKey);

      if (rawValue.length === 0) {
        return rawKey;
      }

      const joinedValue = rawValue.join("=");

      if (!isSensitiveKey(key)) {
        return `${rawKey}=${joinedValue}`;
      }

      redactedFields.push(`${namespace}.${key}`);

      return `${rawKey}=${REDACTED_VALUE}`;
    })
    .join("&");

  return {
    value,
    redactedFields,
  };
}

function redactQueryPart(part: string, namespace: string, redactedFields: string[]) {
  if (part.length === 0) {
    return part;
  }

  const [rawKey, ...rawValue] = part.split("=");
  const key = safeDecodeURIComponent(rawKey);

  if (isSensitiveKey(key)) {
    redactedFields.push(`${namespace}.${key}`);

    return `${rawKey}=${REDACTED_VALUE}`;
  }

  if (rawValue.length === 0) {
    return rawKey;
  }

  return `${rawKey}=${rawValue.join("=")}`;
}

export function redactUrl(rawUrl: string, namespace: string): RedactionResult<string> {
  const redactedFields: string[] = [];
  const queryStart = rawUrl.indexOf("?");

  if (queryStart === -1) {
    return {
      value: rawUrl,
      redactedFields,
    };
  }

  const hashStart = rawUrl.indexOf("#", queryStart);
  const queryEnd = hashStart === -1 ? rawUrl.length : hashStart;
  const prefix = rawUrl.slice(0, queryStart + 1);
  const query = rawUrl.slice(queryStart + 1, queryEnd);
  const suffix = hashStart === -1 ? "" : rawUrl.slice(hashStart);
  const redactedQuery = query
    .split("&")
    .map((part) => redactQueryPart(part, namespace, redactedFields))
    .join("&");

  return {
    value: `${prefix}${redactedQuery}${suffix}`,
    redactedFields,
  };
}

export function redactPlainText(text: string, namespace: string): RedactionResult<string> {
  let value = text;
  const redactedFields: string[] = [];
  const fieldPattern = SENSITIVE_FIELDS.map(escapeRegExp).join("|");
  const keyValuePattern = new RegExp(
    `\\b(${fieldPattern})\\b\\s*([:=])\\s*([^\\s&;,\\n]+)`,
    "gi",
  );

  value = value.replace(keyValuePattern, (match, key: string, separator: string) => {
    if (isSensitiveKey(key)) {
      redactedFields.push(`${namespace}.${key}`);
    }

    return `${key}${separator}${REDACTED_VALUE}`;
  });

  return {
    value,
    redactedFields: unique(redactedFields),
  };
}

export function redactBody(
  body: string | null,
  contentType: string | null,
  namespace: string,
): RedactionResult<string | null> {
  if (!body) {
    return {
      value: body,
      redactedFields: [],
    };
  }

  const lowerContentType = contentType?.toLowerCase() ?? "";

  if (lowerContentType.includes("json") || body.trim().startsWith("{") || body.trim().startsWith("[")) {
    const jsonResult = redactJsonBody(body, namespace);

    if (jsonResult) {
      return jsonResult;
    }
  }

  if (lowerContentType.includes("application/x-www-form-urlencoded")) {
    return redactFormBody(body, namespace);
  }

  return redactPlainText(body, namespace);
}

export function mergeRedactedFields(...fields: string[][]) {
  return unique(fields.flat());
}
