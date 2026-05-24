# Quarry

Quarry is a focused web app for turning raw HTTP evidence into clean vulnerability reports.

It is built for bug bounty hunters, AppSec learners, and solo security researchers who want a faster path from request/response evidence to a report they can actually submit.

The MVP is intentionally narrow: HTTP parsing, redaction, vulnerability templates, finding drafts, and markdown report generation.

## Structure

- `apps/web` - Nuxt frontend
- `apps/api` - Elysia API
- `packages/db` - Drizzle schema, migrations, database client, and seed data
- `packages/shared` - shared constants and TypeScript types
- `packages/config` - shared config package
- `docs` - product, architecture, API, database, and security notes

## Local Development

```bash
pnpm install
docker compose up -d
pnpm dev
```

Database migrations live in `packages/db/drizzle/migrations`.

```bash
pnpm --filter @quarry/db db:generate
pnpm --filter @quarry/db db:migrate
```

## Docs

Good starting points:

1. `docs/PROJECT_CONTEXT.md`
2. `docs/MVP_SCOPE.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DATABASE.md`
5. `docs/API.md`
6. `docs/SECURITY.md`
7. `docs/ROADMAP.md`
8. `docs/TODO.md`

## MVP Rule

Quarry is not trying to be a full bug bounty platform yet. The MVP stays limited to auth, program CRUD, finding CRUD, HTTP parsing, redaction, templates, markdown report generation, and a small dashboard.
