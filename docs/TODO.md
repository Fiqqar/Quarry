# Quarry TODO

## Foundation

- [ ] Create `quarry` repository
- [ ] Initialize pnpm workspace
- [ ] Add Turbo
- [ ] Create root `.gitignore`
- [ ] Create root `.env.example`
- [ ] Create `docker-compose.yml`
- [ ] Create `apps/web`
- [ ] Create `apps/api`
- [ ] Create `packages/db`
- [ ] Create `packages/shared`
- [ ] Create `packages/config`
- [ ] Add root `README.md`
- [ ] Add docs folder

## Shared Package

- [ ] Add severity constants
- [ ] Add priority constants
- [ ] Add status constants
- [ ] Add weakness constants
- [ ] Add sensitive field constants
- [ ] Add API response types
- [ ] Add program types
- [ ] Add finding types
- [ ] Add HTTP artifact types
- [ ] Add report types
- [ ] Export all shared modules

## Database

- [ ] Install Drizzle
- [ ] Configure Drizzle
- [ ] Configure database client
- [ ] Create auth schema or Better Auth adapter tables
- [ ] Create programs schema
- [ ] Create findings schema
- [ ] Create http_artifacts schema
- [ ] Create report_templates schema
- [ ] Create generated_reports schema
- [ ] Create relations
- [ ] Generate migration
- [ ] Run migration
- [ ] Seed default templates

## API Foundation

- [ ] Set up Elysia app
- [ ] Add `/api/v1` prefix
- [ ] Add health route
- [ ] Add env validation
- [ ] Add CORS config
- [ ] Add request ID middleware
- [ ] Add success response helper
- [ ] Add error class
- [ ] Add global error handler
- [ ] Add auth guard placeholder
- [ ] Add rate limit placeholder

## Auth

- [ ] Install Better Auth
- [ ] Configure Better Auth
- [ ] Create auth handler
- [ ] Add session resolver
- [ ] Add register route
- [ ] Add login route
- [ ] Add logout route
- [ ] Add `/auth/me`
- [ ] Test secure cookie session
- [ ] Ensure token is not stored in localStorage

## Programs API

- [ ] Create program validation schema
- [ ] Create program repository
- [ ] Create program service
- [ ] Create program controller
- [ ] Create program routes
- [ ] Add list programs
- [ ] Add create program
- [ ] Add get program detail
- [ ] Add update program
- [ ] Add delete program
- [ ] Ensure all queries are scoped by `user_id`

## Findings API

- [ ] Create finding validation schema
- [ ] Create finding repository
- [ ] Create finding service
- [ ] Create finding controller
- [ ] Create finding routes
- [ ] Add list findings
- [ ] Add finding filters
- [ ] Add create finding
- [ ] Add get finding detail
- [ ] Add update finding
- [ ] Add delete finding
- [ ] Validate program belongs to current user
- [ ] Ensure all queries are scoped by `user_id`

## HTTP Parser and Redaction

- [ ] Create sensitive field list
- [ ] Create redaction utility
- [ ] Redact headers case-insensitively
- [ ] Redact JSON body keys
- [ ] Redact query params
- [ ] Create raw HTTP request parser
- [ ] Create raw HTTP response parser
- [ ] Create request-response pair parser
- [ ] Handle malformed input safely
- [ ] Return parsed preview
- [ ] Return redacted fields list
- [ ] Add max input size limit
- [ ] Ensure raw artifacts are not logged

## HTTP Artifacts API

- [ ] Create HTTP artifact validation schema
- [ ] Create HTTP artifact repository
- [ ] Create HTTP artifact service
- [ ] Create HTTP artifact controller
- [ ] Create HTTP artifact routes
- [ ] Add parse endpoint
- [ ] Add save artifact endpoint
- [ ] Add list artifacts by finding
- [ ] Add delete artifact
- [ ] Ensure finding belongs to current user
- [ ] Ensure artifact belongs to current user

## Report Templates

- [ ] Create template seed data
- [ ] Add IDOR template
- [ ] Add Broken Function Level Authorization template
- [ ] Add Authentication Bypass template
- [ ] Add Stored XSS template
- [ ] Add Reflected XSS template
- [ ] Add SQL Injection template
- [ ] Add SSRF template
- [ ] Add Information Disclosure template
- [ ] Add Race Condition template
- [ ] Add Business Logic Flaw template
- [ ] Add Missing Rate Limit template
- [ ] Add Account Takeover template
- [ ] Add Open Redirect template
- [ ] Add CSRF template
- [ ] Add File Upload Vulnerability template
- [ ] Add Mass Assignment template
- [ ] Add list templates endpoint

## Report Generator

- [ ] Create markdown renderer
- [ ] Inject finding fields into template
- [ ] Include affected URL and method
- [ ] Include severity and priority
- [ ] Include HTTP artifacts as evidence
- [ ] Generate markdown report
- [ ] Save generated report
- [ ] Add latest report endpoint
- [ ] Add export markdown endpoint

## Frontend Foundation

- [ ] Initialize Nuxt app
- [ ] Install Tailwind
- [ ] Configure API base URL
- [ ] Create app layout
- [ ] Create auth layout
- [ ] Create dashboard layout
- [ ] Create sidebar
- [ ] Create topbar
- [ ] Create common components
- [ ] Create API composable

## Frontend Auth

- [ ] Create login page
- [ ] Create register page
- [ ] Create auth store
- [ ] Create auth composable
- [ ] Add auth middleware
- [ ] Add guest middleware
- [ ] Add logout action
- [ ] Show user in topbar

## Frontend Programs

- [ ] Create program list page
- [ ] Create program detail page
- [ ] Create program form
- [ ] Create program card
- [ ] Create program composable
- [ ] Add create program flow
- [ ] Add edit program flow
- [ ] Add delete program confirmation

## Frontend Findings

- [ ] Create findings list page
- [ ] Create new finding page
- [ ] Create finding detail page
- [ ] Create finding form
- [ ] Create finding card
- [ ] Create finding filters
- [ ] Create severity badge
- [ ] Create status badge
- [ ] Create priority badge
- [ ] Add create finding flow
- [ ] Add edit finding flow
- [ ] Add delete finding confirmation

## Frontend HTTP Evidence

- [ ] Create HTTP paste panel
- [ ] Create parse button
- [ ] Create parsed preview
- [ ] Create headers table
- [ ] Create redaction notice
- [ ] Create save artifact button
- [ ] Show artifacts on finding detail

## Frontend Reports

- [ ] Create template selector
- [ ] Create generate report button
- [ ] Create markdown preview
- [ ] Create raw markdown tab
- [ ] Create copy markdown button
- [ ] Create export markdown button
- [ ] Show latest generated report on finding detail

## Dashboard

- [ ] Create dashboard page
- [ ] Add metric cards
- [ ] Add severity breakdown
- [ ] Add status breakdown
- [ ] Add recent findings
- [ ] Add quick action buttons

## Security Hardening

- [ ] Add rate limit to auth endpoints
- [ ] Add rate limit to parser endpoint
- [ ] Lock CORS to frontend origin
- [ ] Ensure secure cookie settings
- [ ] Sanitize markdown preview
- [ ] Remove stack traces in production
- [ ] Prevent raw HTTP artifact logging
- [ ] Add max raw HTTP input size
- [ ] Test IDOR prevention for programs
- [ ] Test IDOR prevention for findings
- [ ] Test IDOR prevention for artifacts
- [ ] Test redaction utility

## Deployment

- [ ] Choose frontend hosting
- [ ] Choose backend hosting
- [ ] Choose database hosting
- [ ] Configure production env
- [ ] Run production migration
- [ ] Deploy API
- [ ] Deploy web
- [ ] Smoke test auth
- [ ] Smoke test program CRUD
- [ ] Smoke test finding CRUD
- [ ] Smoke test HTTP parser
- [ ] Smoke test report generator
