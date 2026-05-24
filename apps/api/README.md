# Quarry API

Elysia API for Quarry.

This app owns backend routing, validation, authorization checks, redaction, report generation, and database access. The frontend should call this API instead of talking to the database directly.

## Development

```bash
pnpm --filter @quarry/api dev
```

The MVP API is planned around `/api/v1`. See `../../docs/API.md` and `../../docs/ARCHITECTURE.md` before adding routes.
