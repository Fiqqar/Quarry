# Quarry TODO

## Foundation

- [x] Create `quarry` repository
- [x] Initialize pnpm workspace
- [x] Add Turbo
- [x] Create root `.gitignore`
- [x] Create root `.env.example`
- [x] Create `docker-compose.yml`
- [x] Create `apps/web`
- [x] Create `apps/api`
- [x] Create `packages/db`
- [x] Create `packages/shared`
- [x] Create `packages/config`
- [x] Add root `README.md`
- [x] Add docs folder

## Shared Package

- [x] Add severity constants
- [x] Add priority constants
- [x] Add status constants
- [x] Add weakness constants
- [x] Add sensitive field constants
- [x] Add API response types
- [x] Add program types
- [x] Add finding types
- [x] Add HTTP artifact types
- [x] Add report types
- [x] Export all shared modules

## Database

- [x] Install Drizzle
- [x] Configure Drizzle
- [x] Configure database client
- [x] Create auth schema or Better Auth adapter tables
- [x] Create programs schema
- [x] Create findings schema
- [x] Create http_artifacts schema
- [x] Create report_templates schema
- [x] Create generated_reports schema
- [x] Create relations
- [x] Generate migration
- [x] Run migration
- [x] Seed default templates

## API Foundation

- [x] Set up Elysia app
- [x] Add `/api/v1` prefix
- [x] Add health route
- [x] Add env validation
- [x] Add CORS config
- [x] Add request ID middleware
- [x] Add success response helper
- [x] Add error class
- [x] Add global error handler
- [x] Add auth guard placeholder
- [ ] Add rate limit placeholder

## Auth

- [x] Install Better Auth
- [x] Configure Better Auth
- [x] Create auth handler
- [x] Add session resolver
- [x] Add register route
- [x] Add login route
- [x] Add logout route
- [x] Add `/auth/me`
- [ ] Test secure cookie session
- [x] Ensure token is not stored in localStorage

## Programs API

- [x] Create program validation schema
- [x] Create program repository
- [x] Create program service
- [x] Create program controller
- [x] Create program routes
- [x] Add list programs
- [x] Add create program
- [x] Add get program detail
- [x] Add update program
- [x] Add delete program
- [x] Ensure all queries are scoped by `user_id`

## Findings API

- [x] Create finding validation schema
- [x] Create finding repository
- [x] Create finding service
- [x] Create finding controller
- [x] Create finding routes
- [x] Add list findings
- [x] Add finding filters
- [x] Add create finding
- [x] Add get finding detail
- [x] Add update finding
- [x] Add delete finding
- [x] Validate program belongs to current user
- [x] Ensure all queries are scoped by `user_id`

## HTTP Parser and Redaction

- [x] Create sensitive field list
- [x] Create redaction utility
- [x] Redact headers case-insensitively
- [x] Redact JSON body keys
- [x] Redact query params
- [x] Create raw HTTP request parser
- [x] Create raw HTTP response parser
- [x] Create request-response pair parser
- [x] Handle malformed input safely
- [x] Return parsed preview
- [x] Return redacted fields list
- [x] Add max input size limit
- [x] Ensure raw artifacts are not logged

## HTTP Artifacts API

- [x] Create HTTP artifact validation schema
- [x] Create HTTP artifact repository
- [x] Create HTTP artifact service
- [x] Create HTTP artifact controller
- [x] Create HTTP artifact routes
- [ ] Add parse endpoint
- [x] Add save artifact endpoint
- [x] Add list artifacts by finding
- [x] Add delete artifact
- [x] Ensure finding belongs to current user
- [x] Ensure artifact belongs to current user

## Report Templates

- [x] Create template seed data
- [x] Add IDOR template
- [x] Add Broken Function Level Authorization template
- [x] Add Authentication Bypass template
- [x] Add Stored XSS template
- [x] Add Reflected XSS template
- [x] Add SQL Injection template
- [x] Add SSRF template
- [x] Add Information Disclosure template
- [x] Add Race Condition template
- [x] Add Business Logic Flaw template
- [x] Add Missing Rate Limit template
- [x] Add Account Takeover template
- [x] Add Open Redirect template
- [x] Add CSRF template
- [x] Add File Upload Vulnerability template
- [x] Add Mass Assignment template
- [x] Add list templates endpoint

## Report Generator

- [x] Create markdown renderer
- [x] Inject finding fields into template
- [x] Include affected URL and method
- [x] Include severity and priority
- [x] Include HTTP artifacts as evidence
- [x] Generate markdown report
- [x] Save generated report
- [x] Add latest report endpoint
- [x] Add export markdown endpoint

## Frontend Foundation

- [x] Initialize Nuxt app
- [x] Install Tailwind
- [x] Configure API base URL
- [x] Create app layout
- [x] Create auth layout
- [x] Create dashboard layout
- [x] Create sidebar
- [x] Create topbar
- [x] Create common components
- [x] Create API composable

## Frontend Auth

- [x] Create login page
- [x] Create register page
- [x] Create auth store
- [x] Create auth composable
- [x] Add auth middleware
- [x] Add guest middleware
- [x] Add logout action
- [x] Show user in topbar

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
- [x] Lock CORS to frontend origin
- [x] Ensure secure cookie settings
- [ ] Sanitize markdown preview
- [x] Remove stack traces in production
- [x] Prevent raw HTTP artifact logging
- [x] Add max raw HTTP input size
- [x] Test IDOR prevention for programs
- [x] Test IDOR prevention for findings
- [x] Test IDOR prevention for artifacts
- [x] Test redaction utility

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
