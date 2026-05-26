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
