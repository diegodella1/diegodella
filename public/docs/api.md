# DiegoDella public API

Base URL: `https://diegodella.ar`

Current API version: `1.2.0`

The API exposes a read-only status operation and the contact delivery operation used by the site's browser form. Canonical operations use the `/api/v1` prefix. They require no account, API key, OAuth token, or other authentication.

## Quickstart

Check the service without causing a side effect:

```sh
curl --fail-with-body \
  -H "Accept: application/json" \
  https://diegodella.ar/api/v1/status
```

Expected shape:

```json
{
  "documentation": "https://diegodella.ar/developers.html",
  "endpoints": ["/api/v1/status", "/api/v1/contact"],
  "ok": true,
  "openapi": "https://diegodella.ar/openapi.json",
  "service": "narrative-mechanics-api",
  "version": "1.2.0"
}
```

No CLI package or SDK installation is required. Use `curl`, another HTTP client, or generate a client or function definition from [openapi.json](https://diegodella.ar/openapi.json).

## GET /api/v1/status

Return current service health, API version, canonical operation paths, and developer-resource links.

- Authentication: none
- Side effects: none
- Success: `200 application/json`
- Errors: `429 application/problem+json`
- Operation ID: `getApiStatus`

This endpoint is appropriate for availability checks, integration discovery, and safe command-line examples.

## POST /api/v1/contact

Validate and deliver a real contact request to Diego.

- Authentication: none
- Side effect: sends an email delivery request
- Success: `200 application/json`
- Errors: `400`, `409`, `429`, or `503 application/problem+json`
- Operation ID: `sendContactRequest`

Request fields:

| Field | Type | Required | Constraint |
| --- | --- | --- | --- |
| `mode` | string | no | `conversation` or `updates`; defaults to `conversation` |
| `name` | string | no | at most 120 characters |
| `email` | string | yes | valid email shape; at most 254 characters |
| `subject` | string | yes | 1–160 characters |
| `message` | string | yes | 1–5000 characters |

Example:

```sh
curl --fail-with-body \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: contact-reader-001" \
  --data '{"mode":"conversation","name":"Reader Name","email":"reader@example.com","subject":"Work with Diego","message":"Context and request details."}' \
  https://diegodella.ar/api/v1/contact
```

Success shape:

```json
{
  "ok": true,
  "id": "provider-delivery-id"
}
```

A successful response means the delivery provider accepted the request. It does not guarantee a reply. Do not use this operation for synthetic monitoring, load tests, or messages that should not be delivered.

## Safe contact retries

When a timeout or connection failure leaves the result unknown, retry the same request with the same `Idempotency-Key`. The key must contain 1–200 visible ASCII characters without spaces. A completed duplicate returns the original success body with `Idempotency-Replayed: true` and does not create another delivery request.

Do not reuse a key for different contact data. That returns `409 application/problem+json` with `code: idempotency_key_reused`. A retry made while the first request is still processing returns `code: idempotency_request_in_progress`; wait briefly, then retry the same payload and key. A failed delivery does not consume the key.

## Problem responses

Errors follow RFC 9457 Problem Details and use `Content-Type: application/problem+json`.

```json
{
  "type": "https://diegodella.ar/docs/problems.md#invalid_email",
  "title": "Invalid contact request",
  "status": 400,
  "detail": "A valid email is required.",
  "instance": "/api/v1/contact",
  "code": "invalid_email",
  "resolution": "Provide an email address containing @ with at most 254 characters.",
  "error": "A valid email is required.",
  "errors": [
    { "field": "email", "code": "invalid_email" }
  ]
}
```

Use `code` for program flow, `resolution` for recovery, and `detail` for human-readable context. The `error` member mirrors `detail` to preserve the existing browser form contract. The [problem catalog](https://diegodella.ar/docs/problems.md) lists stable codes.

## Rate limits

API responses include:

- `RateLimit-Policy`: named quota and window
- `RateLimit`: remaining requests and seconds to reset
- `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`: compatibility fields
- `Retry-After`: seconds to wait on a `429` response

Current policies:

| Policy | Operations | Quota |
| --- | --- | --- |
| `public` | API reads and unsupported API routes | 120 requests per 60 seconds per client |
| `contact` | contact POST operations | 5 requests per 3600 seconds per client |

Clients should read the returned fields rather than hard-code limits. Wait for `Retry-After` before retrying a 429 response.

## Versioning and deprecation

Stable paths use `/api/v1`. New optional response members may be added within v1. Clients must ignore members they do not recognize. Breaking changes move to a new major version path.

The legacy `/api/status` and `/api/contact` aliases remain available. Each legacy response emits:

```http
Deprecation: @1787356800
Link: <https://diegodella.ar/developers.html#versioning>; rel="deprecation"; type="text/html"
```

The structured date identifies when the aliases were marked deprecated. No removal date is scheduled; therefore the API does not send a `Sunset` field. Migrate by replacing `/api/status` with `/api/v1/status` and `/api/contact` with `/api/v1/contact`.

## Environment and CORS

There is one production environment at `https://diegodella.ar` and no separate sandbox. Use the read-only status operation for harmless testing. Cross-origin GET, POST, and OPTIONS are allowed for public operations.

## Machine-readable discovery

- Developer portal: [https://diegodella.ar/developers.html](https://diegodella.ar/developers.html)
- OpenAPI 3.1: [https://diegodella.ar/openapi.json](https://diegodella.ar/openapi.json)
- API catalog: [https://diegodella.ar/.well-known/api-catalog](https://diegodella.ar/.well-known/api-catalog)
- Agentic resource catalog: [https://diegodella.ar/.well-known/ai-catalog.json](https://diegodella.ar/.well-known/ai-catalog.json)
- Authentication policy: [https://diegodella.ar/auth.md](https://diegodella.ar/auth.md)
- Developer llms.txt: [https://diegodella.ar/docs/llms.txt](https://diegodella.ar/docs/llms.txt)
- Live status: [https://diegodella.ar/api/v1/status](https://diegodella.ar/api/v1/status)
- Canonical site data: [https://diegodella.ar/site-data.json](https://diegodella.ar/site-data.json)
- Agent route guide: [https://diegodella.ar/llms.txt](https://diegodella.ar/llms.txt)
- XML sitemap: [https://diegodella.ar/sitemap.xml](https://diegodella.ar/sitemap.xml)
- RSS feed: [https://diegodella.ar/feed.xml](https://diegodella.ar/feed.xml)

The site also exposes a browser-side WebMCP navigation tool for public content routes. Its capability card is available at [https://diegodella.ar/.well-known/mcp/server-card.json](https://diegodella.ar/.well-known/mcp/server-card.json).
