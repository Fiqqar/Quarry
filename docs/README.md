# Quarry Docs

This folder contains the planning and execution documents for Quarry.

## What is Quarry?

Quarry is a web app for bug bounty hunters and AppSec learners that turns raw HTTP evidence into clean vulnerability reports faster.

Core positioning:

```txt
HTTP-to-Report generator with lightweight finding tracking
```

## Read Order

Recommended order:

```txt
1. PROJECT_CONTEXT.md
2. MVP_SCOPE.md
3. TECH_STACK.md
4. ARCHITECTURE.md
5. DATABASE.md
6. API.md
7. SECURITY.md
8. UI_DIRECTION.md
9. ROADMAP.md
10. TODO.md
```

## MVP Rule

Do not overcomplicate MVP.

Focus on:

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

Do not add yet:

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

## Security Rule

All private data must be scoped by `user_id`.

Never query private resources by ID only.

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
