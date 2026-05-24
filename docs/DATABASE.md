# Quarry Database Design

## Database

Use:

```txt
PostgreSQL
```

ORM:

```txt
Drizzle ORM
```

Naming:

```txt
snake_case
```

MVP ownership model:

```txt
single-user
all private data scoped by user_id
```

## Entities

MVP entities:

```txt
users
programs
findings
http_artifacts
report_templates
generated_reports
```

Auth user/session/account tables may be managed by Better Auth.

## Common Columns

Most tables should include:

```txt
id
created_at
updated_at
```

Private user-owned tables should include:

```txt
user_id
```

## programs

Purpose:

A program represents a bug bounty program, VDP, internal target group, or project.

Fields:

```txt
id uuid primary key
user_id text not null
name text not null
platform text
program_url text
scope_notes text
created_at timestamp not null
updated_at timestamp not null
```

Recommended indexes:

```txt
index(user_id)
index(user_id, name)
```

Rules:

- A program always belongs to one user in MVP.
- Deleting a program should not accidentally expose or orphan findings.
- Consider soft delete later, but MVP can hard delete if simpler.

## findings

Purpose:

Main vulnerability draft and report source.

Fields:

```txt
id uuid primary key
user_id text not null
program_id uuid not null references programs(id)
title text not null
severity text not null
priority text
status text not null
weakness text
affected_url text
affected_method text
root_cause text
impact text
steps_to_reproduce text
remediation text
internal_notes text
created_at timestamp not null
updated_at timestamp not null
```

Severity values:

```txt
info
low
medium
high
critical
```

Priority values:

```txt
p5
p4
p3
p2
p1
```

Status values:

```txt
draft
ready
reported
accepted
rejected
duplicate
fixed
```

Recommended indexes:

```txt
index(user_id)
index(user_id, program_id)
index(user_id, severity)
index(user_id, status)
index(user_id, created_at)
```

Rules:

- A finding must belong to a program owned by the same user.
- Never fetch finding by `id` only.
- Always use `id` and `user_id`.
- If program_id is provided, validate that the program belongs to current user.

Safe query rule:

```sql
SELECT * FROM findings
WHERE id = $1
AND user_id = $2;
```

Unsafe query:

```sql
SELECT * FROM findings
WHERE id = $1;
```

## http_artifacts

Purpose:

Stores parsed and redacted HTTP evidence linked to findings.

Fields:

```txt
id uuid primary key
user_id text not null
finding_id uuid not null references findings(id)
type text not null
raw_input text
parsed_method text
parsed_url text
parsed_headers jsonb
parsed_body text
response_status integer
response_headers jsonb
response_body text
redacted_output text
redacted_fields jsonb
created_at timestamp not null
updated_at timestamp not null
```

Type values:

```txt
request
response
request_response_pair
```

Recommended indexes:

```txt
index(user_id)
index(user_id, finding_id)
```

Security rules:

- Redact before saving.
- Avoid storing unredacted secrets.
- Consider storing only redacted raw input in `raw_input`.
- Never log this table's content.
- Limit raw input size.

## report_templates

Purpose:

Stores vulnerability report templates.

Fields:

```txt
id uuid primary key
user_id text nullable
name text not null
weakness text
content_markdown text not null
is_default boolean not null default false
created_at timestamp not null
updated_at timestamp not null
```

Rules:

- `user_id = null` means global built-in template.
- `user_id = currentUser.id` means custom user template.
- MVP can seed global templates only and delay custom templates.

Recommended indexes:

```txt
index(user_id)
index(weakness)
index(is_default)
```

## generated_reports

Purpose:

Stores generated markdown report output.

Fields:

```txt
id uuid primary key
user_id text not null
finding_id uuid not null references findings(id)
template_id uuid references report_templates(id)
content_markdown text not null
created_at timestamp not null
updated_at timestamp not null
```

Recommended indexes:

```txt
index(user_id)
index(user_id, finding_id)
```

Rules:

- Generated reports are user-owned.
- Never fetch by id only.
- Always include user_id.
- Markdown must be rendered safely in frontend.

## Future V2 Tables

Do not implement these in MVP unless necessary:

```txt
workspaces
workspace_members
targets
endpoints
evidences
audit_logs
files
subscriptions
```

## Data Access Rules

### Programs

Create:

```txt
user_id = currentUser.id
```

Read:

```txt
WHERE id = programId
AND user_id = currentUser.id
```

Update:

```txt
WHERE id = programId
AND user_id = currentUser.id
```

Delete:

```txt
WHERE id = programId
AND user_id = currentUser.id
```

### Findings

Read:

```txt
WHERE id = findingId
AND user_id = currentUser.id
```

Create:

```txt
validate program belongs to currentUser.id
insert finding with user_id = currentUser.id
```

### HTTP Artifacts

Create:

```txt
validate finding belongs to currentUser.id
insert artifact with user_id = currentUser.id
```

Read:

```txt
WHERE finding_id = findingId
AND user_id = currentUser.id
```

## Migration Order

Recommended order:

```txt
1. auth tables
2. programs
3. findings
4. http_artifacts
5. report_templates
6. generated_reports
```

## Seed Data

Seed global report templates:

- IDOR
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
