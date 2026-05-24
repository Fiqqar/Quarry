# Quarry Web

Nuxt frontend for Quarry.

The web app is responsible for UI, routing, session display, HTTP evidence input, parsed artifact previews, and markdown report previews. Authorization decisions still belong to the API.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm --filter @quarry/web dev
```

The default local URL is `http://localhost:3000`.

## Notes

Do not store auth tokens in localStorage. Do not render raw unsanitized markdown. See `../../docs/SECURITY.md` before implementing report previews or HTTP artifact views.
