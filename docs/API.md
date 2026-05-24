# Quarry API Contract

## Base URL

```txt
/api/v1
```

## Response Format

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error"
  }
}
```

## Auth

### POST `/auth/register`

Request:

```json
{
  "name": "Quarry User",
  "email": "user@example.com",
  "password": "strong-password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "Quarry User"
    }
  }
}
```

### POST `/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "Quarry User"
    }
  }
}
```

### POST `/auth/logout`

Response:

```json
{
  "success": true,
  "data": {
    "loggedOut": true
  }
}
```

### GET `/auth/me`

Response:

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "Quarry User"
  }
}
```

## Programs

### GET `/programs`

Query:

```txt
?search=nasa&page=1&limit=20
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "program_1",
      "name": "NASA VDP",
      "platform": "VDP",
      "programUrl": "https://example.com",
      "scopeNotes": "Only test listed assets",
      "findingCount": 3,
      "createdAt": "2026-05-24T00:00:00.000Z",
      "updatedAt": "2026-05-24T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### POST `/programs`

Request:

```json
{
  "name": "NASA VDP",
  "platform": "VDP",
  "programUrl": "https://example.com",
  "scopeNotes": "Only test listed assets"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "program_1",
    "name": "NASA VDP",
    "platform": "VDP",
    "programUrl": "https://example.com",
    "scopeNotes": "Only test listed assets"
  }
}
```

### GET `/programs/:programId`

Response:

```json
{
  "success": true,
  "data": {
    "id": "program_1",
    "name": "NASA VDP",
    "platform": "VDP",
    "programUrl": "https://example.com",
    "scopeNotes": "Only test listed assets",
    "findingCount": 3
  }
}
```

### PATCH `/programs/:programId`

Request:

```json
{
  "name": "NASA VDP Updated",
  "scopeNotes": "Updated scope notes"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "program_1",
    "name": "NASA VDP Updated"
  }
}
```

### DELETE `/programs/:programId`

Response:

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

## Findings

### GET `/findings`

Query:

```txt
?programId=program_1&severity=high&status=draft&search=idor&page=1&limit=20
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "finding_1",
      "programId": "program_1",
      "title": "Broken Object Level Authorization on Profile API",
      "severity": "high",
      "priority": "p2",
      "status": "draft",
      "weakness": "IDOR",
      "affectedUrl": "https://api.example.com/api/users/123/profile",
      "affectedMethod": "GET",
      "createdAt": "2026-05-24T00:00:00.000Z",
      "updatedAt": "2026-05-24T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### POST `/findings`

Request:

```json
{
  "programId": "program_1",
  "title": "Broken Object Level Authorization on Profile API",
  "severity": "high",
  "priority": "p2",
  "status": "draft",
  "weakness": "IDOR",
  "affectedUrl": "https://api.example.com/api/users/123/profile",
  "affectedMethod": "GET",
  "rootCause": "The endpoint trusts the user id from the path without verifying object ownership.",
  "impact": "A low privilege user can access another user's profile data.",
  "stepsToReproduce": "1. Login as user A\n2. Change the id in the URL to user B\n3. Observe user B profile data",
  "remediation": "Enforce server-side object ownership checks before returning profile data.",
  "internalNotes": "Need retest with another low privilege account."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "finding_1",
    "title": "Broken Object Level Authorization on Profile API",
    "status": "draft"
  }
}
```

### GET `/findings/:findingId`

Response:

```json
{
  "success": true,
  "data": {
    "id": "finding_1",
    "programId": "program_1",
    "title": "Broken Object Level Authorization on Profile API",
    "severity": "high",
    "priority": "p2",
    "status": "draft",
    "weakness": "IDOR",
    "affectedUrl": "https://api.example.com/api/users/123/profile",
    "affectedMethod": "GET",
    "rootCause": "The endpoint trusts the user id from the path without verifying object ownership.",
    "impact": "A low privilege user can access another user's profile data.",
    "stepsToReproduce": "1. Login as user A\n2. Change id\n3. Observe data",
    "remediation": "Enforce server-side ownership checks.",
    "internalNotes": "Need retest.",
    "httpArtifacts": []
  }
}
```

### PATCH `/findings/:findingId`

Request:

```json
{
  "severity": "critical",
  "priority": "p1",
  "status": "ready"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "finding_1",
    "severity": "critical",
    "priority": "p1",
    "status": "ready"
  }
}
```

### DELETE `/findings/:findingId`

Response:

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

## HTTP Artifacts

### POST `/http-artifacts/parse`

Request:

```json
{
  "raw": "GET /api/users/123 HTTP/2\nHost: example.com\nAuthorization: Bearer abc123\nCookie: session=secret\n\n"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "type": "request",
    "method": "GET",
    "url": "/api/users/123",
    "headers": {
      "Host": "example.com",
      "Authorization": "[REDACTED]",
      "Cookie": "[REDACTED]"
    },
    "body": null,
    "redactedFields": ["Authorization", "Cookie"],
    "redactedOutput": "GET /api/users/123 HTTP/2\nHost: example.com\nAuthorization: [REDACTED]\nCookie: [REDACTED]"
  }
}
```

### POST `/findings/:findingId/http-artifacts`

Request:

```json
{
  "type": "request",
  "rawInput": "GET /api/users/123 HTTP/2\nHost: example.com\nAuthorization: [REDACTED]",
  "parsedMethod": "GET",
  "parsedUrl": "/api/users/123",
  "parsedHeaders": {
    "Host": "example.com",
    "Authorization": "[REDACTED]"
  },
  "parsedBody": null,
  "redactedOutput": "GET /api/users/123 HTTP/2\nHost: example.com\nAuthorization: [REDACTED]",
  "redactedFields": ["Authorization"]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "artifact_1",
    "findingId": "finding_1",
    "type": "request"
  }
}
```

### GET `/findings/:findingId/http-artifacts`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "artifact_1",
      "type": "request",
      "parsedMethod": "GET",
      "parsedUrl": "/api/users/123",
      "parsedHeaders": {
        "Host": "example.com",
        "Authorization": "[REDACTED]"
      },
      "redactedFields": ["Authorization"],
      "createdAt": "2026-05-24T00:00:00.000Z"
    }
  ]
}
```

### DELETE `/http-artifacts/:artifactId`

Response:

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

## Report Templates

### GET `/report-templates`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "template_idor",
      "name": "IDOR / Broken Object Level Authorization",
      "weakness": "IDOR",
      "isDefault": true
    }
  ]
}
```

## Reports

### POST `/findings/:findingId/reports/generate`

Request:

```json
{
  "templateId": "template_idor"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "report_1",
    "findingId": "finding_1",
    "contentMarkdown": "## Summary\n...\n\n## Impact\n..."
  }
}
```

### GET `/findings/:findingId/reports/latest`

Response:

```json
{
  "success": true,
  "data": {
    "id": "report_1",
    "findingId": "finding_1",
    "contentMarkdown": "## Summary\n..."
  }
}
```

### GET `/reports/:reportId/export`

Response:

```json
{
  "success": true,
  "data": {
    "filename": "broken-object-level-authorization.md",
    "content": "## Summary\n..."
  }
}
```

## Dashboard

### GET `/dashboard/summary`

Response:

```json
{
  "success": true,
  "data": {
    "programCount": 4,
    "findingCount": 12,
    "severityBreakdown": {
      "critical": 1,
      "high": 3,
      "medium": 5,
      "low": 2,
      "info": 1
    },
    "statusBreakdown": {
      "draft": 5,
      "ready": 2,
      "reported": 3,
      "accepted": 1,
      "rejected": 1
    },
    "recentFindings": []
  }
}
```

## Security Requirements for API

Every private endpoint must:

1. Require auth.
2. Resolve `currentUser.id`.
3. Query by `id AND user_id`.
4. Validate request body.
5. Return 404 for resources not owned by user.
6. Never leak another user's resource existence.
7. Never return stack traces in production.
