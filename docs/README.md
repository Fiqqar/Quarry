# Quarry Docs

This folder keeps the product, architecture, API, database, and security notes for Quarry.

## What is Quarry?

Quarry helps bug bounty hunters and AppSec learners turn raw HTTP evidence into clean vulnerability reports.

The short version: HTTP-to-report generation with lightweight finding tracking.

## Read Order

1. `PROJECT_CONTEXT.md`
2. `MVP_SCOPE.md`
3. `TECH_STACK.md`
4. `ARCHITECTURE.md`
5. `DATABASE.md`
6. `API.md`
7. `SECURITY.md`
8. `UI_DIRECTION.md`
8. `UI_CONCEPT.md`
9. `ROADMAP.md`
10. `TODO.md`

## Scope Notes

The MVP is deliberately small:

- auth
- program CRUD
- finding CRUD
- HTTP parser
- redaction
- template library
- markdown report generator
- simple dashboard

Workspace, team roles, target inventory, endpoint inventory, PDF export, AI enhancer, file upload, and subscription flows are out of scope for the first version.

## Security Rule

Private data is always scoped by `user_id`. Queries for private resources should include both the resource id and the current user id.

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
