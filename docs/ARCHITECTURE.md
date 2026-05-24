# Quarry Architecture

## High-Level Architecture

```txt
Browser
  |
  | HTTPS
  v
Nuxt Web App
  |
  | API request with secure session cookie
  v
Elysia API
  |
  | Drizzle ORM
  v
PostgreSQL
```

## Repository Architecture

```txt
quarry/
├─ apps/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ db/
│  ├─ shared/
│  └─ config/
├─ docs/
├─ infra/
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ docker-compose.yml
└─ README.md
```

## Frontend App

Path:

```txt
apps/web
```

Responsibilities:

- Render UI
- Route pages
- Manage lightweight UI state
- Call API
- Show parsed HTTP artifacts
- Show markdown report preview
- Copy/export markdown
- Handle user session display

Frontend must not:

- Perform authorization decisions as source of truth
- Access database
- Store auth tokens in localStorage
- Store sensitive HTTP artifacts locally longer than needed
- Render raw unsanitized markdown

Recommended structure:

```txt
apps/web/app/
├─ app.vue
├─ assets/
│  └─ css/
├─ components/
│  ├─ common/
│  ├─ layout/
│  ├─ programs/
│  ├─ findings/
│  ├─ http/
│  └─ reports/
├─ composables/
│  ├─ useApi.ts
│  ├─ useAuth.ts
│  ├─ usePrograms.ts
│  ├─ useFindings.ts
│  ├─ useHttpParser.ts
│  └─ useReports.ts
├─ layouts/
│  ├─ default.vue
│  ├─ auth.vue
│  └─ dashboard.vue
├─ middleware/
│  ├─ auth.ts
│  └─ guest.ts
├─ pages/
│  ├─ index.vue
│  ├─ login.vue
│  ├─ register.vue
│  ├─ dashboard.vue
│  ├─ programs/
│  ├─ findings/
│  ├─ templates/
│  └─ settings.vue
├─ stores/
│  ├─ auth.store.ts
│  └─ ui.store.ts
└─ utils/
```

## Backend API

Path:

```txt
apps/api
```

Responsibilities:

- Auth
- API routes
- Input validation
- Authorization checks
- Business logic
- Database queries
- HTTP parsing
- Redaction
- Report generation
- Error handling
- Rate limiting
- CORS

Recommended structure:

```txt
apps/api/src/
├─ index.ts
├─ app.ts
├─ config/
│  ├─ env.ts
│  ├─ cors.ts
│  └─ security.ts
├─ auth/
│  ├─ auth.ts
│  ├─ auth.handler.ts
│  └─ session.ts
├─ common/
│  ├─ errors/
│  ├─ guards/
│  ├─ middleware/
│  ├─ response/
│  └─ utils/
│     ├─ redact.ts
│     ├─ http-parser.ts
│     └─ markdown.ts
└─ modules/
   ├─ health/
   ├─ programs/
   ├─ findings/
   ├─ http-artifacts/
   ├─ report-templates/
   ├─ reports/
   └─ dashboard/
```

## Backend Layering Rule

Every backend module should follow this pattern:

```txt
routes -> controller -> service -> repository
```

Layer responsibilities:

```txt
routes:
- URL definition
- HTTP method
- validation schema
- auth guard

controller:
- extract request input
- call service
- return response

service:
- business logic
- authorization-specific decisions
- orchestration between repositories

repository:
- database queries only
```

Do not query database directly from routes.

Do not put business logic in route handlers.

## Shared Packages

### `packages/db`

Responsibilities:

- Drizzle schema
- Drizzle relations
- Database client
- Migrations
- Seed script

Structure:

```txt
packages/db/
├─ src/
│  ├─ index.ts
│  ├─ client.ts
│  ├─ schema/
│  │  ├─ auth.schema.ts
│  │  ├─ programs.schema.ts
│  │  ├─ findings.schema.ts
│  │  ├─ http-artifacts.schema.ts
│  │  ├─ report-templates.schema.ts
│  │  └─ generated-reports.schema.ts
│  ├─ relations.ts
│  └─ seed.ts
├─ drizzle/
│  └─ migrations/
└─ drizzle.config.ts
```

### `packages/shared`

Responsibilities:

- Shared enums
- Shared API types
- Shared constants
- Shared validation-related types

Structure:

```txt
packages/shared/
├─ src/
│  ├─ index.ts
│  ├─ constants/
│  │  ├─ severity.ts
│  │  ├─ priority.ts
│  │  ├─ status.ts
│  │  ├─ weaknesses.ts
│  │  └─ sensitive-fields.ts
│  └─ types/
│     ├─ api.ts
│     ├─ program.ts
│     ├─ finding.ts
│     ├─ http-artifact.ts
│     └─ report.ts
```

## Data Ownership Model

MVP uses single-user ownership.

Every private entity must have:

```txt
user_id
```

Private resources:

- programs
- findings
- http_artifacts
- generated_reports
- custom report_templates

Every private query must include:

```txt
WHERE id = resourceId
AND user_id = currentUser.id
```

## Request Flow Example

Finding detail request:

```txt
GET /api/v1/findings/:findingId

1. requireAuth resolves current user
2. controller gets findingId
3. service asks repository for finding by id and user id
4. repository queries:
   WHERE id = findingId AND user_id = currentUser.id
5. if not found, return 404
6. return finding
```

## Report Generation Flow

```txt
User opens finding detail
-> User selects template
-> User clicks generate report
-> API loads finding by finding_id and user_id
-> API loads related HTTP artifacts by finding_id and user_id
-> API loads selected template
-> report renderer injects finding data and evidence
-> generated markdown is saved
-> markdown returned to frontend
```

## HTTP Artifact Flow

```txt
User pastes raw HTTP
-> frontend sends raw text to parser endpoint
-> backend parses raw text
-> backend redacts sensitive fields
-> backend returns parsed preview
-> user confirms save
-> backend stores redacted artifact linked to finding
```

## Security Boundary

The backend is the security boundary.

Frontend route middleware is only for UX.

Backend must enforce:

- authentication
- ownership
- validation
- redaction
- rate limiting
- CORS
- safe error handling

## V2 Architecture Expansion

MVP:

```txt
user_id scoped
```

V2:

```txt
workspace_id scoped
workspace_members
roles
team collaboration
audit logs
```

Do not implement V2 structure in MVP unless it is necessary.
