# Quarry MVP Scope

## MVP Goal

Build the smallest useful version of Quarry that proves the core product value:

> A user can turn raw HTTP evidence into a clean vulnerability report faster than doing it manually.

## MVP Must-Have Features

### 1. Authentication

Required:

- Register
- Login
- Logout
- Current user endpoint
- Secure session cookie

Not required:

- OAuth
- Magic link
- Email verification
- Password reset
- 2FA

### 2. Program CRUD

A program represents a bug bounty program, VDP, internal app, or target group.

Required:

- Create program
- List programs
- View program detail
- Edit program
- Delete program

Fields:

- name
- platform
- program_url
- scope_notes

### 3. Finding CRUD

A finding is the main vulnerability report draft.

Required:

- Create finding
- List findings
- Filter findings
- View finding detail
- Edit finding
- Delete finding

Fields:

- title
- program_id
- severity
- priority
- status
- weakness
- affected_url
- affected_method
- root_cause
- impact
- steps_to_reproduce
- remediation
- internal_notes

### 4. Raw HTTP Paste

Required:

- Textarea for raw HTTP request/response
- Submit parse button
- Preview parsed result
- Save parsed artifact to finding

Sources to support:

- Burp Suite raw HTTP
- Browser DevTools copy as cURL, later optional
- Raw request format
- Raw response format
- Request-response pair format, best effort

### 5. HTTP Parser

Required parser output:

- method
- URL/path
- headers
- query params
- body
- response status if available
- response headers if available
- response body if available

Parser should be best-effort, not perfect.

Malformed input should return a friendly error.

### 6. Redaction

Required:

- Auto-redact known sensitive headers and fields.
- Store redacted version by default.
- Show list of redacted fields.
- Prevent accidental storage of obvious secrets.

Sensitive keys:

```txt
authorization
cookie
set-cookie
x-api-key
x-auth-token
x-csrf-token
access_token
refresh_token
id_token
api_key
password
passwd
secret
client_secret
token
jwt
otp
private_key
session
```

### 7. Vulnerability Templates

Required initial templates:

- IDOR / Broken Object Level Authorization
- Broken Function Level Authorization
- Authentication Bypass
- Stored XSS
- Reflected XSS
- SQL Injection
- SSRF
- Information Disclosure
- Race Condition
- Business Logic Flaw
- Missing Rate Limit
- Account Takeover
- Open Redirect
- CSRF
- File Upload Vulnerability
- Mass Assignment

Each template should include:

- default title format
- weakness
- root cause starter
- impact starter
- remediation starter
- report structure

### 8. Markdown Report Generator

Required:

- Generate markdown from finding fields
- Include HTTP evidence section
- Include template-based structure
- Copy markdown button
- Export `.md` file

Default structure:

```md
## Summary

## Affected Asset

## Severity

## Root Cause

## Impact

## Steps to Reproduce

## Evidence

## Remediation
```

### 9. Simple Dashboard

Required metrics:

- total programs
- total findings
- findings by severity
- findings by status
- recent findings

## Explicitly Out of Scope for MVP

Do not build these yet:

- Workspace
- Workspace members
- Role-based access
- Team collaboration
- Target inventory
- Endpoint inventory
- Audit log complex
- File upload evidence
- PDF export
- AI report enhancer
- Subscription
- Browser extension
- Burp Suite extension
- CVSS calculator
- CWE full database
- OWASP mapping automation
- Client-side encryption
- Zero-knowledge mode
- Self-hosted Docker package

## MVP Success Criteria

The MVP is successful if:

1. A user can create an account.
2. A user can create a program.
3. A user can create a finding.
4. A user can paste raw HTTP evidence.
5. Quarry parses and redacts the evidence.
6. Quarry generates a readable markdown report.
7. User can copy or export the report.
8. All private data is scoped by `user_id`.
9. Obvious secrets are not stored in raw form by default.
10. The app feels faster than manual report writing.

## Anti-Scope-Creep Rule

Any feature that does not directly improve the HTTP-to-report workflow must be delayed.

Ask this before adding a feature:

> Does this help the user submit a better vulnerability report faster?

If the answer is no, delay it.
