# Quarry Development Roadmap

## Current Phase

Planning complete.

Next phase:

```txt
Project initialization and foundation setup
```

## Phase 0: Foundation Decisions

Status: complete.

Decisions:

```txt
Project name: Quarry
Frontend: Nuxt
Backend: Elysia.js + Bun
Database: PostgreSQL
ORM: Drizzle
Auth: Better Auth
Package manager: pnpm
Monorepo tool: Turbo
MVP model: single-user scoped by user_id
```

MVP scope locked:

```txt
auth
program CRUD
finding CRUD
HTTP parser
redaction
template library
markdown report generator
simple dashboard
```

Out of scope:

```txt
workspace
team roles
target inventory
endpoint inventory
PDF export
AI enhancer
file upload
subscription
```

## Phase 1: Init Monorepo

Goal:

Create project skeleton.

Tasks:

```txt
mkdir quarry
cd quarry
pnpm init
create pnpm-workspace.yaml
create turbo.json
create .gitignore
create .env.example
create docker-compose.yml
create apps/web
create apps/api
create packages/db
create packages/shared
create packages/config
create docs
```

Success criteria:

```txt
pnpm install works
pnpm dev command exists
folder structure is ready
PostgreSQL can run locally
```

## Phase 2: Shared Package

Goal:

Create shared constants and types.

Files:

```txt
packages/shared/src/constants/severity.ts
packages/shared/src/constants/priority.ts
packages/shared/src/constants/status.ts
packages/shared/src/constants/weaknesses.ts
packages/shared/src/constants/sensitive-fields.ts
packages/shared/src/types/api.ts
packages/shared/src/types/program.ts
packages/shared/src/types/finding.ts
packages/shared/src/types/http-artifact.ts
packages/shared/src/types/report.ts
packages/shared/src/index.ts
```

Success criteria:

```txt
apps/api can import from packages/shared
apps/web can import from packages/shared
```

## Phase 3: Database Setup

Goal:

Set up PostgreSQL and Drizzle.

Files:

```txt
packages/db/package.json
packages/db/drizzle.config.ts
packages/db/src/client.ts
packages/db/src/schema/programs.schema.ts
packages/db/src/schema/findings.schema.ts
packages/db/src/schema/http-artifacts.schema.ts
packages/db/src/schema/report-templates.schema.ts
packages/db/src/schema/generated-reports.schema.ts
packages/db/src/relations.ts
packages/db/src/seed.ts
```

Success criteria:

```txt
database connects
drizzle migration runs
tables created
seed templates inserted
```

## Phase 4: API Foundation

Goal:

Set up Elysia API base.

Files:

```txt
apps/api/src/index.ts
apps/api/src/app.ts
apps/api/src/config/env.ts
apps/api/src/config/cors.ts
apps/api/src/common/errors/app-error.ts
apps/api/src/common/errors/error-handler.ts
apps/api/src/common/response/success.ts
apps/api/src/common/guards/require-auth.ts
apps/api/src/modules/health/health.routes.ts
```

Success criteria:

```txt
GET /api/v1/health returns ok
error format is consistent
CORS configured
env validation works
```

## Phase 5: Auth

Goal:

Implement Better Auth.

Files:

```txt
apps/api/src/auth/auth.ts
apps/api/src/auth/auth.handler.ts
apps/api/src/auth/session.ts
apps/api/src/modules/users/user.routes.ts
```

Endpoints:

```txt
POST /auth/register
POST /auth/login
POST /auth/logout
GET /auth/me
```

Success criteria:

```txt
user can register
user can login
user can logout
private endpoint can resolve current user
session uses secure httpOnly cookie
```

## Phase 6: Programs Module

Goal:

Implement program CRUD.

Files:

```txt
apps/api/src/modules/programs/program.schema.ts
apps/api/src/modules/programs/program.repository.ts
apps/api/src/modules/programs/program.service.ts
apps/api/src/modules/programs/program.controller.ts
apps/api/src/modules/programs/program.routes.ts
```

Endpoints:

```txt
GET /programs
POST /programs
GET /programs/:programId
PATCH /programs/:programId
DELETE /programs/:programId
```

Security criteria:

```txt
all queries scoped by user_id
```

## Phase 7: Findings Module

Goal:

Implement finding CRUD.

Files:

```txt
apps/api/src/modules/findings/finding.schema.ts
apps/api/src/modules/findings/finding.repository.ts
apps/api/src/modules/findings/finding.service.ts
apps/api/src/modules/findings/finding.controller.ts
apps/api/src/modules/findings/finding.routes.ts
```

Endpoints:

```txt
GET /findings
POST /findings
GET /findings/:findingId
PATCH /findings/:findingId
DELETE /findings/:findingId
```

Security criteria:

```txt
validate program belongs to user before creating finding
all finding queries scoped by user_id
```

## Phase 8: HTTP Parser and Redaction

Goal:

Build core differentiator.

Files:

```txt
apps/api/src/common/utils/http-parser.ts
apps/api/src/common/utils/redact.ts
apps/api/src/modules/http-artifacts/http-artifact.schema.ts
apps/api/src/modules/http-artifacts/http-artifact.repository.ts
apps/api/src/modules/http-artifacts/http-artifact.service.ts
apps/api/src/modules/http-artifacts/http-artifact.controller.ts
apps/api/src/modules/http-artifacts/http-artifact.routes.ts
```

Endpoints:

```txt
POST /http-artifacts/parse
POST /findings/:findingId/http-artifacts
GET /findings/:findingId/http-artifacts
DELETE /http-artifacts/:artifactId
```

Success criteria:

```txt
raw request can be parsed
raw response can be parsed
sensitive fields are redacted
artifact can be saved to finding
artifacts are scoped by user_id
```

## Phase 9: Report Templates and Generator

Goal:

Generate markdown reports.

Files:

```txt
apps/api/src/modules/report-templates/template.repository.ts
apps/api/src/modules/report-templates/template.service.ts
apps/api/src/modules/report-templates/template.routes.ts
apps/api/src/modules/reports/report-renderer.ts
apps/api/src/modules/reports/report.repository.ts
apps/api/src/modules/reports/report.service.ts
apps/api/src/modules/reports/report.controller.ts
apps/api/src/modules/reports/report.routes.ts
```

Endpoints:

```txt
GET /report-templates
POST /findings/:findingId/reports/generate
GET /findings/:findingId/reports/latest
GET /reports/:reportId/export
```

Success criteria:

```txt
default templates available
report generated from finding
HTTP artifacts included
markdown can be exported
```

## Phase 10: Nuxt Frontend Setup

Goal:

Set up frontend shell.

Files:

```txt
apps/web/nuxt.config.ts
apps/web/app/app.vue
apps/web/app/assets/css/main.css
apps/web/app/layouts/auth.vue
apps/web/app/layouts/dashboard.vue
apps/web/app/components/layout/AppSidebar.vue
apps/web/app/components/layout/AppTopbar.vue
apps/web/app/components/layout/DashboardShell.vue
apps/web/app/composables/useApi.ts
```

Success criteria:

```txt
frontend runs
API base URL configured
dashboard shell visible
```

## Phase 11: Frontend Auth

Goal:

Implement auth UI.

Files:

```txt
apps/web/app/pages/login.vue
apps/web/app/pages/register.vue
apps/web/app/middleware/auth.ts
apps/web/app/middleware/guest.ts
apps/web/app/stores/auth.store.ts
apps/web/app/composables/useAuth.ts
```

Success criteria:

```txt
user can register from UI
user can login from UI
protected pages redirect guest
guest pages redirect logged-in user
```

## Phase 12: Frontend Programs

Goal:

Build program UI.

Files:

```txt
apps/web/app/pages/programs/index.vue
apps/web/app/pages/programs/[programId].vue
apps/web/app/components/programs/ProgramCard.vue
apps/web/app/components/programs/ProgramForm.vue
apps/web/app/composables/usePrograms.ts
```

Success criteria:

```txt
create program
list programs
edit program
delete program
open program detail
```

## Phase 13: Frontend Findings

Goal:

Build finding UI.

Files:

```txt
apps/web/app/pages/findings/index.vue
apps/web/app/pages/findings/new.vue
apps/web/app/pages/findings/[findingId].vue
apps/web/app/components/findings/FindingCard.vue
apps/web/app/components/findings/FindingForm.vue
apps/web/app/components/findings/FindingFilters.vue
apps/web/app/composables/useFindings.ts
```

Success criteria:

```txt
create finding
list findings
filter findings
edit finding
delete finding
open finding detail
```

## Phase 14: Frontend HTTP Panel

Goal:

Build HTTP parser UI.

Files:

```txt
apps/web/app/components/http/HttpPastePanel.vue
apps/web/app/components/http/HttpParsedPreview.vue
apps/web/app/components/http/HttpHeadersTable.vue
apps/web/app/components/http/RedactionNotice.vue
apps/web/app/composables/useHttpParser.ts
```

Success criteria:

```txt
paste raw HTTP
parse raw HTTP
preview parsed result
show redacted fields
save artifact to finding
```

## Phase 15: Frontend Report Preview

Goal:

Build report generation UI.

Files:

```txt
apps/web/app/components/reports/TemplateSelector.vue
apps/web/app/components/reports/ReportPreview.vue
apps/web/app/components/reports/MarkdownViewer.vue
apps/web/app/components/reports/ExportMarkdownButton.vue
apps/web/app/composables/useReports.ts
```

Success criteria:

```txt
select template
generate report
preview markdown
copy markdown
export markdown
```

## Phase 16: Dashboard

Goal:

Build simple metrics dashboard.

Files:

```txt
apps/api/src/modules/dashboard/dashboard.routes.ts
apps/api/src/modules/dashboard/dashboard.service.ts
apps/api/src/modules/dashboard/dashboard.repository.ts
apps/web/app/pages/dashboard.vue
apps/web/app/components/dashboard/MetricCard.vue
apps/web/app/components/dashboard/RecentFindings.vue
```

Success criteria:

```txt
show total programs
show total findings
show severity breakdown
show status breakdown
show recent findings
```

## Phase 17: Security Hardening

Checklist:

```txt
rate limit auth
rate limit parser
sanitize markdown preview
validate all bodies
CORS locked
no raw artifact logging
secure cookie config
consistent error handling
resource access tests
```

## Phase 18: Deploy MVP

Goal:

Deploy first usable version.

Targets:

```txt
frontend: Vercel or Netlify
backend: Railway or Fly.io
database: Neon or Supabase Postgres
```

Smoke test:

```txt
register
login
create program
create finding
paste HTTP
parse and redact
save artifact
generate report
copy/export markdown
```
