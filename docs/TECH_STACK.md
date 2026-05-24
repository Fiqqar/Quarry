# Quarry Tech Stack

## Final Stack

Frontend:

- Nuxt
- Vue
- Tailwind CSS
- Pinia
- Nuxt composables
- TypeScript

Backend:

- Elysia.js
- Bun
- TypeScript

Database:

- PostgreSQL

ORM:

- Drizzle ORM

Auth:

- Better Auth

Architecture:

- Monorepo
- Frontend and backend separated
- Shared packages for database schema, enums, and types

Deployment target:

- Frontend: Vercel or Netlify
- Backend: Railway, Fly.io, or VPS
- Database: Neon, Supabase Postgres, or Railway Postgres

## Why Nuxt

Nuxt is used for the frontend because:

- The user is comfortable with Nuxt.
- File-based routing is fast for dashboard apps.
- Vue components are easy to iterate.
- Nuxt composables are good for API wrappers.
- It can be deployed easily.
- It keeps frontend development focused and fast.

## Why Elysia.js

Elysia.js is used for the backend because:

- Modern TypeScript-first API framework.
- Works well with Bun.
- Good performance.
- Clean route structure.
- Good fit for a small but scalable API.
- Easier to keep backend separate from frontend.

## Why PostgreSQL

PostgreSQL is used because:

- Quarry data is relational.
- Programs have many findings.
- Findings have many HTTP artifacts and generated reports.
- Strong consistency matters.
- JSONB can be used for parsed headers and flexible metadata.

## Why Drizzle ORM

Drizzle is used because:

- Type-safe.
- SQL-like.
- Lightweight.
- Good migration workflow.
- Schema stays close to the database.
- Works well in TypeScript monorepos.

## Why Better Auth

Better Auth is used because:

- TypeScript-first.
- Modern auth design.
- Works with separate backend.
- Can use secure cookie sessions.
- Extensible for future auth needs.

## Package Manager

Use:

```txt
pnpm
```

Reason:

- Good monorepo support.
- Efficient dependency storage.
- Works well with Turbo.

## Runtime

Use:

```txt
bun
```

Primarily for backend runtime.

## Monorepo Tool

Use:

```txt
turbo
```

For:

- Running dev scripts across apps/packages
- Build orchestration
- Lint/typecheck pipeline

## Local Development

Use:

```txt
PostgreSQL via Docker Compose
```

Local services:

- web app
- API server
- PostgreSQL database

## Environment Files

Recommended:

```txt
.env.example
apps/web/.env
apps/api/.env
packages/db/.env
```

But avoid committing real `.env`.

## Required Environment Variables

API:

```txt
NODE_ENV=development
API_PORT=3001
DATABASE_URL=postgres://postgres:postgres@localhost:5432/quarry
AUTH_SECRET=replace-with-long-random-secret
WEB_ORIGIN=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

Web:

```txt
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

## Naming Convention

Database:

```txt
snake_case
```

Examples:

```txt
user_id
created_at
updated_at
program_id
```

TypeScript:

```txt
camelCase
```

Examples:

```txt
userId
createdAt
updatedAt
programId
```

API:

```txt
REST-style
/api/v1
```

Branches:

```txt
feat/auth
feat/findings
fix/http-parser
refactor/report-generator
```

Commits:

```txt
feat(api): add findings crud
feat(web): add login page
fix(parser): handle malformed headers
refactor(report): simplify markdown renderer
```

## Stack Boundaries

Frontend must not:

- Access database directly
- Trust itself for authorization
- Store secrets in localStorage
- Render unsanitized markdown

Backend must:

- Validate all inputs
- Scope all private data by `user_id`
- Redact sensitive data before save
- Return consistent errors
- Avoid logging raw HTTP artifacts
