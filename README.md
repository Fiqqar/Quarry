# Quarry

Quarry is a web app for bug bounty hunters and AppSec learners that turns raw HTTP evidence into clean vulnerability reports faster.

Core positioning:

HTTP-to-Report generator with lightweight finding tracking.

## Structure

- apps/web: Nuxt frontend
- apps/api: Elysia.js backend
- packages/db: Drizzle schema and database client
- packages/shared: shared types, enums, and constants
- packages/config: shared config
- docs: project planning and architecture docs

## Important Docs

Start here:

1. docs/PROJECT_CONTEXT.md
2. docs/MVP_SCOPE.md
3. docs/ARCHITECTURE.md
4. docs/DATABASE.md
5. docs/API.md
6. docs/SECURITY.md
7. docs/ROADMAP.md
8. docs/TODO.md

## MVP Rule

Do not expand the MVP scope.

Focus only on auth, program CRUD, finding CRUD, HTTP parser, redaction, templates, markdown report generator, and simple dashboard.
