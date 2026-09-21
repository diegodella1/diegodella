---
title: "DiegoDella developer portal"
description: "Public API quickstart, operations, typed errors, rate limits, versioning, and discovery resources."
canonical: "https://diegodella.ar/developers.html"
last-updated: "2026-08-22"
---

# DiegoDella developer portal

The site exposes a small public HTTP API at `https://diegodella.ar`. It supports capability inspection and the same contact action available in the browser. The canonical v1 operations require no account or API key.

## Quickstart

The status operation is read-only and safe for integration checks:

```sh
curl --fail-with-body \
  -H "Accept: application/json" \
  https://diegodella.ar/api/v1/status
```

No package installation is required. Use any HTTP client or import the [OpenAPI 3.1 description](https://diegodella.ar/openapi.json) to generate a client or tool definition.

## Operations

- `GET /api/v1/status` — Return health, service version, canonical operations, documentation, and OpenAPI links. No side effects.
- `POST /api/v1/contact` — Deliver a real professional inquiry, correction, privacy request, or updates request to Diego. This operation has a side effect.

See the [full Markdown API reference](https://diegodella.ar/docs/api.md) for request and response examples.

## Authentication and environment

Authentication is not required. There are no API keys, OAuth credentials, paid tiers, or accounts. Never include secrets in request bodies.

The standalone [authentication reference](https://diegodella.ar/auth.md) gives machine-readable access, CORS, quota, and retry details.

There is one production base URL and no separate sandbox. Use `GET /api/v1/status` for harmless tests. Call `POST /api/v1/contact` only when a real message should be delivered.

## Errors

Errors use `application/problem+json`. Responses include the RFC 9457 members `type`, `title`, `status`, `detail`, and `instance`, plus stable `code` and actionable `resolution` extensions. Validation failures can include field-level `errors` entries. See the [problem catalog](https://diegodella.ar/docs/problems.md).

## Rate limits

Responses expose `RateLimit-Policy` and `RateLimit`, with compatibility fields. Public reads allow 120 requests per minute per client. Contact writes allow 5 requests per hour. A 429 response includes `Retry-After`.

## Safe retries

For a contact request that may need a network retry, send one stable `Idempotency-Key` containing 1–200 visible ASCII characters without spaces. Repeating the same payload and key replays the first successful response with `Idempotency-Replayed: true` and does not create another delivery. Reusing a key with different data returns a typed 409 problem.

## Versioning and deprecation

Stable operations use `/api/v1`. Additive fields may appear within v1; ignore fields you do not recognize. Breaking changes move to a new major path.

Legacy `/api/status` and `/api/contact` aliases emit the HTTP `Deprecation` field and a `Link` with `rel="deprecation"`. No removal date is scheduled, so no `Sunset` field is sent.

## Machine-readable resources

- [OpenAPI 3.1](https://diegodella.ar/openapi.json)
- [API catalog](https://diegodella.ar/.well-known/api-catalog)
- [Agentic resource catalog](https://diegodella.ar/.well-known/ai-catalog.json)
- [Authentication policy](https://diegodella.ar/auth.md)
- [Developer llms.txt](https://diegodella.ar/docs/llms.txt)
- [API status](https://diegodella.ar/api/v1/status)
- [llms.txt](https://diegodella.ar/llms.txt)
- [XML sitemap](https://diegodella.ar/sitemap.xml)
- [Canonical site data](https://diegodella.ar/site-data.json)

## Contact and privacy

- [Contact](https://diegodella.ar/contact.html)
- [Privacy](https://diegodella.ar/privacy.html)
