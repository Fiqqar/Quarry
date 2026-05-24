export const SENSITIVE_FIELDS = [
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "x-auth-token",
  "x-csrf-token",
  "access_token",
  "refresh_token",
  "id_token",
  "api_key",
  "password",
  "passwd",
  "secret",
  "client_secret",
  "token",
  "jwt",
  "otp",
  "private_key",
  "session",
] as const;

export const REDACTED_VALUE = "[REDACTED]";
export const RAW_HTTP_INPUT_MAX_LENGTH = 200_000;

export type SensitiveField = (typeof SENSITIVE_FIELDS)[number];

