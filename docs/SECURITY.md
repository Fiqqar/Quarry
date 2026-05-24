# Quarry Security Requirements

## Security Philosophy

Quarry stores sensitive vulnerability research data.

The core security rule:

> Treat all user-provided HTTP artifacts as sensitive and untrusted.

The app must be designed so that accidental secret storage and cross-user access are prevented from the beginning.

## Auth Security

Use:

```txt
secure httpOnly cookie session
```

Do not use:

```txt
localStorage for auth tokens
```

Cookie requirements in production:

```txt
HttpOnly
Secure
SameSite=Lax or Strict
```

Session must be validated on the backend for every private request.

Frontend route middleware is only UX protection.

## Data Ownership

MVP uses single-user ownership.

Every private table must include:

```txt
user_id
```

Every private resource query must include:

```txt
resource.id = id
AND resource.user_id = currentUser.id
```

Good:

```sql
SELECT * FROM findings
WHERE id = $1
AND user_id = $2;
```

Bad:

```sql
SELECT * FROM findings
WHERE id = $1;
```

## IDOR Prevention

High-risk endpoints:

```txt
GET /programs/:programId
PATCH /programs/:programId
DELETE /programs/:programId

GET /findings/:findingId
PATCH /findings/:findingId
DELETE /findings/:findingId

GET /findings/:findingId/http-artifacts
POST /findings/:findingId/http-artifacts
DELETE /http-artifacts/:artifactId

GET /reports/:reportId/export
```

All of these must verify ownership.

Recommended behavior:

- Return `404 Not Found` when the resource does not belong to current user.
- Do not return `403` for cross-user resource access in MVP because it can leak existence.

## Input Validation

All request bodies must be validated.

Important limits:

```txt
program.name: 1-120 chars
program.platform: max 80 chars
program.program_url: valid URL or empty
program.scope_notes: max 5000 chars

finding.title: 3-180 chars
finding.severity: enum only
finding.priority: enum only
finding.status: enum only
finding.weakness: max 120 chars
finding.affected_url: max 2000 chars
finding.affected_method: enum-like or max 20 chars
finding.root_cause: max 10000 chars
finding.impact: max 10000 chars
finding.steps_to_reproduce: max 15000 chars
finding.remediation: max 10000 chars
finding.internal_notes: max 10000 chars

raw_http_input: max 200000 chars for MVP
```

## Redaction

Sensitive fields must be redacted before saving.

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

Redaction output:

```txt
[REDACTED]
```

Header examples:

```txt
Authorization: [REDACTED]
Cookie: [REDACTED]
Set-Cookie: [REDACTED]
X-Api-Key: [REDACTED]
```

JSON body examples:

```json
{
  "password": "[REDACTED]",
  "token": "[REDACTED]"
}
```

Rules:

- Redact case-insensitively.
- Redact nested JSON keys if possible.
- Redact query params like `?token=...`.
- Store redacted artifact by default.
- Keep track of redacted field names.
- Warn user if raw input still appears to contain secrets.

## Logging Rules

Never log:

```txt
raw HTTP artifact
Authorization header
Cookie
Set-Cookie
password
token
secret
api key
OTP
private key
session
full request body from auth routes
```

Safe logs:

```txt
request_id
method
path
status_code
duration_ms
user_id
```

## Markdown Security

Quarry renders user-provided markdown.

Risk:

```txt
Stored XSS
```

Rules:

- Sanitize markdown preview.
- Do not render raw HTML.
- Do not use `v-html` without sanitizer.
- HTTP response bodies must be shown inside code blocks.
- Generated report preview should escape dangerous HTML.

## CORS

Production CORS must only allow trusted frontend origin.

Do not use:

```txt
Access-Control-Allow-Origin: *
```

Especially when using cookies.

Required:

```txt
CORS_ORIGIN=https://your-quarry-frontend.com
credentials=true
```

## Rate Limiting

Minimum limits:

```txt
POST /auth/login: 5 attempts per 10 minutes per IP
POST /auth/register: 5 attempts per hour per IP
POST /http-artifacts/parse: 60 requests per minute per user
POST /findings/:id/reports/generate: 30 requests per minute per user
General API: 300 requests per minute per user
```

## Error Handling

Production errors must not leak stack traces.

Good:

```json
{
  "success": false,
  "error": {
    "code": "FINDING_NOT_FOUND",
    "message": "Finding not found"
  }
}
```

Bad:

```json
{
  "error": "Cannot read properties of undefined at finding.service.ts:42"
}
```

## File Upload

File upload is out of scope for MVP.

When implemented later:

- Limit file size.
- Reject executable files.
- Reject or sanitize SVG.
- Store random filename.
- Do not trust user-provided filename.
- Use object storage.
- Scan or restrict MIME types.

## Future Security Improvements

V2 or later:

- Client-side encryption
- Zero-knowledge mode
- Self-hosted version
- Encrypted evidence vault
- Audit logs
- Workspace role-based access
- Device/session management
- 2FA
- Export backup
