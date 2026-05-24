# Quarry UI Direction

## Visual Identity

Quarry should feel like:

```txt
professional hacker utility
dark dashboard
clean AppSec tool
fast workflow
not edgy
not childish
not generic SaaS
```

## Brand Metaphor

Quarry means a place for digging or mining.

Product metaphor:

```txt
dig target
extract evidence
shape finding
ship report
```

Possible visual references:

- stone
- slate
- excavation
- layers
- raw material becoming polished output
- minimal pickaxe
- stylized Q
- carved terminal-like panels

## Color Direction

MVP recommended:

```txt
dark mode only
slate/stone background
amber accent
neutral text
subtle borders
```

Suggested palette concept:

```txt
background: slate / zinc / neutral dark
surface: slightly lighter slate
border: muted stone
primary accent: amber
success: emerald
danger: red
warning: amber
info: cyan
```

Do not overuse neon.

Keep it professional enough for portfolio and AppSec users.

## Layout Style

General:

- Compact dashboard
- Sidebar navigation
- Topbar with user/account menu
- Card-based content
- Rounded corners
- Subtle borders
- Minimal shadow
- Good spacing
- Clear typography

Recommended border radius:

```txt
rounded-xl or rounded-2xl
```

Recommended style:

```txt
border-based depth over heavy shadow
```

## Main Navigation

```txt
Dashboard
Programs
Findings
Templates
Settings
```

MVP pages:

```txt
/login
/register
/dashboard
/programs
/programs/:programId
/findings
/findings/new
/findings/:findingId
/templates
/settings
```

## Dashboard Page

Purpose:

Show overview and quick actions.

Sections:

```txt
Metric cards:
- total programs
- total findings
- open findings
- ready reports

Charts:
- severity breakdown
- status breakdown

Lists:
- recent findings
- recent programs

Actions:
- New Finding
- New Program
```

## Programs Page

Purpose:

Manage bug bounty programs or target groups.

List card fields:

```txt
program name
platform
program URL
finding count
created date
```

Actions:

```txt
create
edit
delete
open program
```

## Findings Page

Purpose:

Central report/finding tracker.

List filters:

```txt
search
program
severity
status
priority
weakness
```

Finding card/table fields:

```txt
title
program
severity
priority
status
weakness
affected URL
updated date
```

Actions:

```txt
new finding
open detail
edit
delete
generate report
```

## Finding Detail Page

Recommended layout:

```txt
Main content:
- title
- affected URL
- method
- severity
- weakness
- root cause
- impact
- steps to reproduce
- remediation
- report preview

Side panel:
- status
- priority
- program
- HTTP artifacts
- generated report
- timestamps
```

## HTTP Paste Panel

This is one of the most important UI components.

Required elements:

```txt
raw HTTP textarea
parse button
redaction status
parsed preview
headers table
body preview
save to finding button
```

Parsed preview should show:

```txt
method
url/path
headers
query params
body
response status
response headers
response body
redacted fields
```

Sensitive fields should be visibly marked as redacted.

## Report Preview

Required:

```txt
markdown preview
raw markdown tab
copy button
export .md button
generate button
template selector
```

Use tabs:

```txt
Preview
Markdown
Evidence
```

## Component Structure

Recommended:

```txt
components/
├─ common/
│  ├─ AppButton.vue
│  ├─ AppInput.vue
│  ├─ AppTextarea.vue
│  ├─ AppSelect.vue
│  ├─ AppModal.vue
│  ├─ AppBadge.vue
│  ├─ EmptyState.vue
│  └─ LoadingState.vue
├─ layout/
│  ├─ DashboardShell.vue
│  ├─ AppSidebar.vue
│  └─ AppTopbar.vue
├─ programs/
│  ├─ ProgramCard.vue
│  ├─ ProgramForm.vue
│  └─ ProgramList.vue
├─ findings/
│  ├─ FindingCard.vue
│  ├─ FindingForm.vue
│  ├─ FindingFilters.vue
│  ├─ SeverityBadge.vue
│  ├─ StatusBadge.vue
│  └─ PriorityBadge.vue
├─ http/
│  ├─ HttpPastePanel.vue
│  ├─ HttpParsedPreview.vue
│  ├─ HttpHeadersTable.vue
│  └─ RedactionNotice.vue
└─ reports/
   ├─ ReportPreview.vue
   ├─ MarkdownViewer.vue
   ├─ TemplateSelector.vue
   └─ ExportMarkdownButton.vue
```

## UX Rules

1. Every form must have loading state.
2. Every list must have empty state.
3. Every destructive action must have confirmation.
4. Every API error must show a readable message.
5. Report copy/export must be one click.
6. HTTP parser errors must be helpful.
7. Redacted fields must be clearly visible.
8. Finding creation should not feel like filling a huge boring form.

## MVP UI Priority

Build UI in this order:

```txt
1. Auth pages
2. Dashboard shell
3. Program list and form
4. Finding list and form
5. Finding detail
6. HTTP paste panel
7. Report preview
8. Copy/export markdown
```

## What Not to Build Yet

Do not spend MVP time on:

- complex animations
- full design system
- light mode
- profile customization
- charts that are hard to implement
- drag and drop
- kanban board
- team UI
- workspace switcher
- file upload UI
