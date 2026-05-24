# Quarry Project Context

## Project Name

**Quarry**

## One-Liner

Quarry is a focused web app that helps bug bounty hunters and AppSec learners turn raw HTTP evidence into clean vulnerability reports faster.

## Product Positioning

Quarry is not a generic note app and not a full bug bounty management platform in the MVP.

Quarry is:

> HTTP-to-Report generator with lightweight finding tracking.

The MVP must focus on speed, clarity, and security.

## Core Problem

Bug bounty hunters often collect evidence from Burp Suite, browser DevTools, curl, or proxy logs. The raw evidence usually needs manual cleanup before it can be submitted as a clear report.

Common pain points:

- Raw HTTP request and response need manual formatting.
- Authorization headers, cookies, API keys, tokens, passwords, and secrets need manual redaction.
- Report structure often becomes inconsistent.
- Beginner hunters struggle to write strong root cause, impact, steps to reproduce, and remediation sections.
- Notion, Obsidian, Excel, or random markdown files are flexible but not specialized for vulnerability reporting.

## Core Solution

Quarry lets the user:

1. Create a program.
2. Create a finding.
3. Paste raw HTTP request or response.
4. Auto-parse method, URL, headers, body, params, and response status.
5. Auto-redact sensitive data.
6. Select a vulnerability template.
7. Fill report fields.
8. Generate a clean markdown report.
9. Copy or export the report.

## Taglines

Primary:

> Turn raw HTTP evidence into clean vulnerability reports.

Alternative:

> Dig bugs. Shape reports. Ship findings.

Alternative:

> From raw request to polished report in minutes.

## Target Users

Primary:

- Bug bounty hunter pemula sampai menengah
- Pelajar cyber security
- CTF player yang mulai masuk bug bounty
- AppSec learner
- Security researcher solo

Secondary:

- AppSec engineer
- Internal security tester
- Pentester solo
- Student portfolio builder

## MVP Philosophy

The MVP should prove one thing:

> Quarry makes report writing faster than writing manually in Notion, Obsidian, or raw markdown.

Do not build features just because they sound professional.

Do not turn Quarry into Attack Surface Management.

Do not add team collaboration yet.

Do not add workspace and roles yet.

Keep MVP single-user and scoped by `user_id`.

## Final MVP Features

Must have:

- Auth login/register
- Program CRUD
- Finding CRUD
- Raw HTTP paste
- HTTP parser
- Sensitive data redaction
- Vulnerability template library
- Markdown report generator
- Copy markdown
- Export markdown
- Simple dashboard

Must not have in MVP:

- Workspace
- Team collaboration
- Role-based access
- Target inventory
- Endpoint inventory
- PDF export
- File upload evidence
- Audit log complex
- Subscription
- AI report enhancer
- Browser extension
- Burp Suite extension
- ASM features

## Core User Flow

```txt
User login
-> Create program
-> Create finding
-> Paste raw HTTP request/response
-> Quarry parses HTTP data
-> Quarry redacts sensitive fields
-> User selects vulnerability template
-> User fills root cause, impact, steps, remediation
-> Quarry generates markdown report
-> User copies/exports report
```

## Product Differentiators

Quarry must feel like a hacker-specific utility, not a note app.

Main differentiators:

1. Raw HTTP parser
2. One-click redaction
3. Vulnerability template library
4. Markdown report generator
5. Lightweight finding tracker

## Future Direction

After MVP validation, Quarry can evolve into:

- Self-hosted report builder
- Encrypted evidence vault
- Team workspace
- Bug bounty workflow tracker
- Burp Suite companion
- AI-assisted report editor
- Client-side encrypted security research notebook
