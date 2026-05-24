export const WEAKNESSES = [
  "IDOR / Broken Object Level Authorization",
  "Broken Function Level Authorization",
  "Authentication Bypass",
  "Stored XSS",
  "Reflected XSS",
  "SQL Injection",
  "SSRF",
  "Information Disclosure",
  "Race Condition",
  "Business Logic Flaw",
  "Missing Rate Limit",
  "Account Takeover",
  "Open Redirect",
  "CSRF",
  "File Upload Vulnerability",
  "Mass Assignment",
] as const;

export type Weakness = (typeof WEAKNESSES)[number];

