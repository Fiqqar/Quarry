# Quarry UI Concept

## Design Thesis

Quarry is designed as a serious AppSec workbench for solo security researchers who move fast and think carefully. The interface treats raw HTTP evidence as the starting material and the polished markdown report as the finished product. Every surface, color, and interaction choice supports this single workflow: ingest untrusted raw data, sanitize it visibly, structure it with intent, and export it with confidence. The UI is dense because bug bounty hunters manage many findings and programs simultaneously. It is dark to reduce eye strain during long sessions. It is calm and unobtrusive because the user's attention belongs to the vulnerability evidence, not the interface chrome.

## Product Feel

Quarry should feel fast, focused, technical, trustworthy, and private. It should feel like a tool built specifically for report writing, not a generic note-taking app. Interactions should be immediate: parse happens in milliseconds, copy is one click, and navigation is instant. The interface should communicate security awareness through visible redaction, clear ownership, and direct language.

Quarry should not feel like a cyberpunk toy, a generic SaaS dashboard, a marketing website, a bloated bug bounty platform, or an AI writing tool. Avoid neon aesthetics, purple-blue gradient hero sections, collaboration messaging, feature comparison grids, and magic-wand iconography.

## Visual System

### Color Palette

Background: very dark slate, near-black with a subtle cool-gray tint. The canvas should recede completely.

Surface: slightly elevated panels use a lighter slate or zinc tone, clearly separated from the background but remaining dark.

Border: muted zinc or stone gray, low contrast, 1px solid. Used for cards, panels, table rows, and input outlines.

Amber accent: warm amber for primary actions, active navigation states, focus rings, high severity badges, and important counters. Visible but not orange-neon.

Text: light zinc for primary text, mid zinc for secondary labels, darker zinc for placeholders and disabled states. Pure white is reserved only for emphasis.

Success: muted emerald for accepted findings, fixed status, and positive confirmations.

Danger: muted red for destructive actions, critical severity, and errors.

Warning: amber shared with the primary accent for ready status and parser warnings.

Info: muted cyan for reported status and neutral informational hints.

### Typography

UI text: clean sans-serif, 14px base size, line height 1.4, medium weight for labels and buttons.

Code and evidence: monospace font, 13px, line height 1.6, used for HTTP headers, raw requests, URLs, and the markdown raw view.

Headings: sans-serif, 18px to 24px, semibold, light zinc color.

### Spacing and Density

Compact layout. Use 16px gutters between major sections, 12px to 16px internal padding inside cards, and 8px gaps between tightly related elements.

Tables use minimal vertical padding, approximately 8px to 10px per row, to maximize visible rows.

Forms stack with 16px gaps between fields.

### Border Radius

Use 6px for small elements such as badges, inputs, and buttons.

Use 8px for cards, panels, and modals.

Avoid fully rounded pill shapes except for small status badges.

### Borders, Shadows, and Elevation

1px solid borders provide most of the elevation and separation.

Use shadows sparingly and subtly, only for modals and dropdown menus, with dark-colored offsets.

Do not use glassmorphism, heavy blur, or multi-layer drop shadows.

### Icon Style

Use simple line icons with uniform stroke width. Icons should be functional, not decorative.

Do not use filled icons, colored icon illustrations, or emoji replacements.

### Empty States

Empty states should use a centered outline icon, concise text, and a primary action button when applicable.

Do not use illustrations, mascots, or decorative graphics.

### Loading States

Use dark gray skeleton screens that pulse subtly. Avoid spinners in main content areas; use them only inside buttons.

### Error States

Use a red left border or red text. Form validation errors appear inline, while global errors use toast notifications. Never use browser alert modals.

## App Shell

The app shell consists of a fixed left sidebar, a fixed topbar, and a scrollable main content area.

Sidebar: fixed left, 240px wide, full viewport height. Contains the Quarry logo and primary navigation links. Collapses to icon-only on screens below 1024px, or becomes a drawer triggered by a hamburger menu on mobile.

Topbar: fixed, 56px to 64px tall, spanning the width above the main content. The left side holds the page title or breadcrumb. The right side holds the user menu dropdown and any global action buttons.

Main content: scrollable area below the topbar and to the right of the sidebar. Padding of 24px to 32px. No strict max-width constraint; tables and grids fill the available space.

Page header: sits at the top of the main content. Contains a large page title on the left and the primary page action button on the right. Optional subtitle or metadata appears below the title.

Responsive behavior: on smaller screens, the sidebar hides. The topbar gains a menu button. Content padding reduces to 16px. Touch targets remain at least 40px.

Daily use support: the layout remains persistent across routes. Navigation stays in place while content swaps. The shell should feel like a native workbench that stays out of the way.

## Navigation

MVP navigation contains five items only.

Dashboard: contains summary metrics, severity and status breakdowns, and a short list of recent findings. It belongs in MVP because users need immediate orientation after logging in. It should not include complex analytics, charts, team activity feeds, or trend lines.

Programs: contains the list of bug bounty programs, VDPs, or target groups. It belongs in MVP because findings are organized by program. It should not include workspace management, team sharing, import tools, or bulk operations.

Findings: contains the central list of vulnerability findings with filters. It belongs in MVP because this is the core entity and daily driver. It should not include kanban views, bulk select, assignee labels, or board layouts.

Templates: contains the 16 built-in vulnerability report templates for browsing. It belongs in MVP because users need to see available templates before generating reports. It should not include custom template creation, editing, or deletion. Custom templates are delayed.

Settings: contains minimal account information and logout. It belongs in MVP for basic account hygiene. It should not include team management, billing, API keys, password reset flows, or notification preferences.

## Page Concepts

### Login

Purpose: authenticate existing users.

Layout: centered single card on a dark background. No sidebar or topbar.

Key components: email input, password input, primary submit button, text link to register.

Primary action: sign in.

Loading behavior: button disabled, label changes to "Signing in...".

Error behavior: inline text below the form, "Invalid email or password." No shaking animations.

What not to include: OAuth buttons, magic links, forgot password links, social login icons.

### Register

Purpose: create a new account.

Layout: centered card, visually consistent with login.

Key components: name input, email input, password input, submit button, link to login.

Primary action: create account.

Loading behavior: button disabled, label changes to "Creating account...".

Error behavior: inline validation per field.

What not to include: email verification messaging, terms of service checkbox, plan selection.

### Dashboard

Purpose: orient the user and summarize activity.

Layout: grid of four metric cards at the top. Below, a two-column layout with severity breakdown on the left and status breakdown on the right. Below that, a recent findings table showing the last five updated items.

Key components: metric cards, breakdown list, recent findings table.

Primary actions: "New Finding" and "New Program" quick action buttons.

Empty state: if there are zero programs, display a centered prompt: "Create your first program to start tracking findings," with a primary action button.

Loading behavior: skeleton rectangles for metric cards, skeleton rows for the table.

What not to include: complex charts, trend graphs, time-series analytics, team feeds.

### Programs List

Purpose: manage bug bounty programs and target groups.

Layout: page header with a "New Program" primary button on the right. Below, a responsive card grid or dense table.

Key components: program card showing name, platform badge, program URL, finding count, and created date. Program form modal for creation and editing.

Primary actions: create program, edit program, delete program.

Empty state: "No programs yet. Create a program to start tracking findings." with a primary button.

Loading behavior: skeleton cards.

What not to include: CSV import, bulk delete, program analytics, target inventory.

### Program Detail

Purpose: view a specific program and see all findings linked to it.

Layout: header with program name, platform badge, and URL. Program scope notes displayed in a panel. Below, a findings table filtered to this program.

Key components: program info panel, finding list table.

Primary actions: edit program, delete program, create a new finding for this program.

Empty state: if the program has no findings, show an inline CTA: "Create a finding for this program."

Loading behavior: skeleton header, skeleton table rows.

What not to include: member lists, workspace settings, endpoint inventory, program-level analytics.

### Findings List

Purpose: central tracker for all vulnerability findings.

Layout: sticky filter bar at the top with search input, program select, severity select, and status select. Below, a dense table or list view.

Key components: finding filters bar, finding table rows showing title, program name, severity badge, status badge, priority badge, weakness, affected URL truncated, and updated date.

Primary actions: apply or clear filters, create finding.

Empty state: "No findings match your filters" or "No findings yet. Create your first finding."

Loading behavior: skeleton table rows.

What not to include: kanban board, bulk select checkboxes, CSV export, assignee columns.

### New Finding

Purpose: create a new vulnerability finding.

Layout: full-width dense form. Two-column layout recommended: main narrative fields on the left, metadata fields on the right.

Key components: finding form with fields for title, program select, severity select, priority select, status select defaulting to draft, weakness input, affected URL, affected method select, root cause textarea, impact textarea, steps to reproduce textarea, remediation textarea, and internal notes textarea.

Primary action: save as draft.

Loading behavior: button disabled with "Saving...".

Error behavior: inline field validation, summary at top if multiple errors exist.

What not to include: AI suggestion panels, CVSS score inputs, CWE picker, file upload zones.

### Finding Detail

Purpose: view, edit, and build the report for a single finding. This is the main workspace of the app.

Layout: two-column layout. The left main column is wider and contains the finding title, affected URL and method line, and a tabbed interface for Details, Evidence, and Report. The right sidebar contains status badge, priority badge, severity badge, program link, timestamps, and action buttons.

Key components: tab bar, finding field viewers with inline edit toggles, HTTP artifact list, report preview panel.

Primary actions: edit finding, delete finding, add HTTP evidence, generate report, copy markdown, export markdown.

Empty state: if no HTTP evidence exists, display a prominent prompt in the Evidence tab: "Paste raw HTTP request or response." If no report exists, prompt in the Report tab: "Generate a report from this finding."

Loading behavior: skeleton for tab content, button loading state for report generation.

What not to include: activity log, comments, assignees, watchers, file attachments.

### Templates

Purpose: browse the built-in vulnerability report templates.

Layout: page header, then a card grid or table listing all 16 templates.

Key components: template card showing template name, weakness tag, and a short description. Template detail modal or expandable view showing the full default structure.

Primary action: view template content.

Empty state: not applicable; templates are globally seeded.

What not to include: create template button, edit controls, delete controls, custom template forms.

### Settings

Purpose: minimal account management.

Layout: single column with sections separated by subtle dividers.

Key components: read-only account info card displaying name and email, logout button.

Primary action: logout.

What not to include: password change form, theme toggle, team management, billing, API tokens, notification preferences.

## Core Workflow: HTTP Evidence To Report

### Raw HTTP Input

The user opens the Evidence tab inside a finding and sees a large monospace textarea. It has a minimum height equivalent to twenty rows, a subtle amber left border when focused, and a dark background slightly lighter than the page. A placeholder shows a minimal GET request example. A character count sits below the textarea, enforcing a maximum of 200,000 characters. A prominent amber primary button labeled "Parse evidence" sits below the textarea.

### Parse Action

Clicking the parse button triggers validation. The button enters a loading state with the text "Parsing...". If the input is malformed, an inline error appears directly below the button: "Malformed HTTP input. Check the request format and try again," accompanied by a small format hint. No modal dialog is used. If valid, the view smoothly expands to show the parsed preview below the input.

### Parsed Preview

The parsed preview renders as a structured panel. It displays the method as a text badge, the full URL or path on a separate line, query parameters if detected, headers in a compact two-column table, the body inside a dark code block, and response status with response headers if a response was included. The layout is dense and scannable.

### Redacted Fields List

Within the parsed preview, an amber notice banner appears with a shield icon: "3 sensitive fields redacted: Authorization, Cookie, X-Api-Key." In the headers table and body, redacted values display literally as `[REDACTED]` in amber-colored text. The user sees exactly what was hidden and why. Redaction is automatic and not optional in the MVP.

### Saved Evidence State

After clicking "Save to finding," the artifact appears in the Evidence tab of the finding detail. Each artifact card shows a type badge indicating request, response, or request-response pair, the parsed method, the URL, the count of redacted fields, and a timestamp. The user can expand the card to view the full parsed and redacted content again.

### Template Selector

In the Report tab, a select dropdown lists all 16 built-in templates by name and weakness. If the finding's weakness field matches a template, that template is preselected.

### Report Field Editing

The narrative sections of the report, root cause, impact, steps to reproduce, and remediation are edited directly in the Details tab of the finding. There is no separate report form. These fields feed directly into the generated markdown.

### Markdown Preview Tabs

The Report tab contains a tab bar with three options: Preview, Markdown, and Evidence. Preview shows a safely sanitized rendered markdown view with the default sections: Summary, Affected Asset, Severity, Root Cause, Impact, Steps to Reproduce, Evidence, and Remediation. Markdown shows the raw generated text in a dark code block with a copy button. Evidence shows a read-only list of linked HTTP artifacts.

### Copy Markdown

A prominent primary button in the Report tab copies the full markdown to the clipboard in one click. A toast notification confirms: "Report copied to clipboard."

### Export Markdown

A secondary button next to the copy button triggers a download of the report as a `.md` file. The filename is derived from the finding title, sanitized for filesystem safety.

### Error Cases

Malformed HTTP is handled inline with specific messaging. Parser failures return a friendly message without technical stack traces. If the user attempts to generate a report without a template selected, an inline prompt asks them to choose one.

### Fast and Safe Feel

The textarea supports `Ctrl+Enter` to trigger parsing. Auto-focus moves to the textarea when the Evidence tab is opened. Redaction happens automatically and is communicated instantly. Saving an artifact and generating a report both occur in-place without page transitions.

## Component Concepts

### Buttons

Primary: amber background, very dark text, 6px radius, semibold. Hover increases brightness slightly. Active state scales down subtly. Used for Parse, Save, Generate, and Copy.

Secondary: transparent background, 1px zinc border, zinc-300 text. Hover adds a zinc-800 background. Used for Cancel, Export, and secondary actions.

Danger: transparent background, 1px red border, red-400 text. Hover adds a subtle red-tinted background. Used for Delete.

Ghost: text only, zinc-400. Hover shifts to zinc-300. Used for subtle actions like "Clear filters."

Loading: disabled opacity, spinner icon to the left of contextual text such as "Parsing..." or "Saving...". Never use generic "Loading" alone.

### Inputs

Background: dark slate or zinc, slightly lighter than the page background. Border: zinc-700. Focus: 2px amber ring with amber border. Radius: 6px. Height: 36px to 40px. Text color: zinc-200. Placeholder: zinc-500.

### Textareas

Same styling as inputs but taller. The HTTP evidence textarea is the signature component: monospace font, resize vertical only, dark background, subtle amber focus glow. Scrollbar styled dark and thin.

### Selects

Custom dropdown trigger matching input height and styling. Dropdown panel: dark surface, zinc border, 8px radius. Options render as full-width rows with hover state in slate-800. Selected option uses an amber left border or amber text with a checkmark icon.

### Badges

Severity: critical uses red, high uses amber, medium uses yellow, low uses cyan, info uses zinc. Small shape with 4px radius, uppercase or small caps, semibold, subtle tinted background.

Status: draft uses zinc, ready uses amber, reported uses cyan, accepted uses emerald, rejected uses red, fixed uses emerald. Same shape as severity.

Priority: p1 uses red, p2 uses amber, p3 uses yellow, p4 uses cyan, p5 uses zinc.

All badges avoid solid neon fills; they use low-opacity backgrounds with matching text.

### Tables and Lists

Header text in zinc-500, small size, uppercase or wide tracking, border-bottom in zinc-700.

Rows are 40px tall with a subtle border-bottom in zinc-800. Hover state applies a slate-800 or translucent overlay.

No vertical outer borders. Action buttons align to the rightmost column as icon-only ghost buttons.

### Cards and Panels

Background one step lighter than the page. Border: 1px solid zinc-800. Radius: 8px. Padding: 16px to 20px.

Panel titles use zinc-300, 14px, semibold, often with an overline style and a subtle bottom border separator.

No shadow by default.

### Modals

Overlay: near-black at 80% opacity. Panel: dark surface, 8px radius, max-width 640px, max-height 90vh, internally scrollable.

Header contains the title and a close X. Footer aligns action buttons to the right.

Used for delete confirmations, program forms, and template detail viewing.

### Tabs

Horizontal row of text buttons. Inactive: zinc-400 text, no border. Active: amber text with a 2px amber bottom border. Background remains transparent. Padding: 12px by 16px.

Used in finding detail for Details, Evidence, and Report, and in the report section for Preview, Markdown, and Evidence.

### Toasts and Errors

Toast: fixed top-right position, dark surface, 4px left border in amber for information or red for errors. Contains a title and message, auto-dismisses after four seconds, and includes a manual close button.

Inline form error: red text, 13px, positioned directly below the relevant field.

Global error: a banner at the top of the content area, red border, dismissible.

### Markdown Preview

Rendered inside a contained panel with a dark background. All content is sanitized before rendering. No raw HTML execution, no script tags, no inline event handlers. External links include safe `rel` attributes. Code blocks have a slightly different dark background and subtle border. The panel is scrollable for long reports.

### HTTP Headers Table

Two columns: Name at 30% width in monospace zinc-400, Value at 70% width in monospace zinc-300. Redacted values display as `[REDACTED]` in amber text. No outer border. Row separators are 1px zinc-800. Vertical padding is compact at 4px.

### Redaction Notice

A horizontal banner or inline block with a 2px amber left border, an amber shield or eye-off icon, and text stating the count and names of redacted fields. Always visible when redaction has occurred. Never hidden behind a tooltip or secondary click.

## Content Tone

The writing style is concise, calm, technical, direct, and security-aware. There is no hype, no cute copy, and no vague AI-style text.

Good examples:

- "Paste raw HTTP"
- "Parse evidence"
- "3 fields redacted"
- "Copy markdown"
- "Finding saved"
- "Malformed HTTP input"
- "Generate report"
- "No findings yet"
- "Program deleted"
- "Check the HTTP format and try again"

Examples to avoid:

- "Unlock your security potential"
- "Supercharge your workflow"
- "AI-powered insights"
- "Let's make magic"
- "Your journey begins here"
- "Seamless integration"
- "Oops! Something went wrong"

Button labels should use verbs: Save, Delete, Generate, Copy, Export, Parse, Cancel. Avoid "Get Started," "Learn More," or "Discover."

Error messages should be direct and safe: "Invalid email or password," "Program not found," "Check the HTTP format and try again." Avoid "Oops!" and generic "Something went wrong" messaging.

## Accessibility and Safety

Color contrast: all text must meet WCAG AA standards against its background. Amber on dark slate must maintain a minimum 4.5:1 ratio. Zinc-400 on slate-950 must be readable.

Focus states: every interactive element must have a visible 2px solid amber outline with a 2px offset. Keyboard navigation must be fully supported.

Keyboard navigation: logical tab order through forms. Enter activates buttons. Escape closes modals. `Ctrl+Enter` triggers HTTP parsing from the textarea. Arrow keys navigate custom select dropdowns.

Font sizes: minimum 14px for UI text. Inputs must use 16px minimum to prevent mobile browser zoom.

Scroll behavior: the HTTP textarea uses a max-height with internal scrolling. Preview panels use max-height with internal scrolling. The main layout and sidebar scroll independently.

Markdown preview safety: all rendered markdown is sanitized. No raw HTML is executed. No script tags, style tags, or inline event handlers are allowed. Code blocks are rendered as text only.

Redacted field visibility: redacted fields are always explicitly listed by name. The literal text `[REDACTED]` is displayed in the UI. Never rely on color alone to indicate redaction.

Sensitive value handling: sensitive values are never shown in full in the interface. There is no reveal or unredact toggle in the MVP.

Destructive action confirmation: deleting a program, finding, or artifact requires a modal confirmation with a clear consequence statement, such as "Delete this finding? This cannot be undone." The confirm button is red.

Error safety: the UI never displays stack traces, database error details, internal IDs, or raw API error objects to the user.

## MVP Build Order

1. App shell: build the sidebar, topbar, and main content grid first. All subsequent pages render inside this frame.
2. Auth pages: implement login and register as centered cards. These gate the rest of the application.
3. Dashboard shell: build the metric card layout and recent findings list. This gives users immediate value after authentication.
4. Programs pages: implement the program list, creation modal, and detail view. This establishes the data hierarchy.
5. Findings pages: implement the findings list with filters and the new finding form. This is the core entity CRUD.
6. Finding detail layout: build the two-column shell with tabs for Details, Evidence, and Report. This is the main workspace container.
7. HTTP paste panel: implement the signature textarea, parse button, and preview container. This is the core differentiator.
8. Parsed preview and redaction UI: build the headers table, body code block, and redaction notice. This is the trust and safety moment.
9. Template selector: add the template dropdown to the Report tab. This connects the finding to a report structure.
10. Report preview: implement the sanitized markdown render, raw markdown tab, and evidence tab. This is the primary output.
11. Copy and export actions: add the copy-to-clipboard and download-to-file buttons. These complete the workflow.
12. Empty, loading, and error state polish: add skeleton screens, empty state messages with icons, and inline error banners. This makes the application feel finished and robust.

This order is practical because it builds structural dependencies first, then establishes data flow from programs to findings, then constructs the core HTTP-to-report workflow inside the finding detail, and finally polishes the experience with state handling.

## Non-Goals

The following must not be designed, referenced, or given reserved space in the MVP UI:

- Workspace switcher
- Team or member management UI
- Roles and permissions selectors
- Target inventory pages
- Endpoint inventory pages
- File upload evidence UI or drag-and-drop zones
- PDF export button or print layout
- AI enhancer UI, sparkle icons, or suggestion panels
- Subscription, billing, or plan selection UI
- Browser extension settings or install prompts
- Burp Suite extension integration panel
- Kanban board or drag-and-drop columns
- CVSS calculator or score display
- CWE database browser or mapping UI
- Advanced analytics, trend graphs, or time-series charts
- Complex audit log or activity feed

These features are explicitly out of scope for the MVP per the product requirements. The interface should not contain disabled buttons, placeholder navigation items, or "coming soon" badges for these features. If they are added in a future version, they will require new navigation items and page layouts designed specifically for them.
