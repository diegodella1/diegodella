# API authentication

## Overview

The DiegoDella Public API at `https://diegodella.ar/api/v1` is public and does not use authentication. There are no API keys, bearer tokens, OAuth flows, user accounts, paid API tiers, or credential-issuance endpoints.

## Credentials

Send no `Authorization` header. Never put passwords, tokens, private keys, or other secrets in a contact request. Both canonical operations are declared with `security: []` in [openapi.json](https://diegodella.ar/openapi.json).

## Discovery metadata

Because every operation is anonymous, the site intentionally publishes no `oauth-protected-resource` or `oauth-authorization-server` metadata. It exposes no `agent_auth` flow and uses no `register_uri`. A client should call the canonical operations directly without performing OAuth discovery or dynamic registration.

## Operations

- `GET /api/v1/status` is read-only and safe for health or discovery checks.
- `POST /api/v1/contact` creates a real email delivery request. Call it only when a message should be delivered.

## Request example

```sh
curl --fail-with-body \
  -H "Accept: application/json" \
  https://diegodella.ar/api/v1/status
```

## CORS

Public operations allow cross-origin `GET`, `POST`, and `OPTIONS`. Contact requests may send `Content-Type: application/json` and `Idempotency-Key`.

## Quotas and retries

Read `RateLimit-Policy`, `RateLimit`, and compatibility rate fields on every API response. A 429 response includes `Retry-After`. For a contact retry after an unknown network outcome, resend the identical body with the same `Idempotency-Key`; do not reuse a key for different data.

## Errors

Errors use `application/problem+json` with RFC 9457 fields, a stable `code`, and an actionable `resolution`. See the [problem catalog](https://diegodella.ar/docs/problems.md) and [full API reference](https://diegodella.ar/docs/api.md).

## Security contact

Report an API or site security issue through [the contact page](https://diegodella.ar/contact.html) or email `dellagostino@gmail.com`. Do not include exploit data or secrets in a public URL.
