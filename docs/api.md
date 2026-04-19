# Narrative Mechanics API

Base URL: `https://diegodella.ar`

This site exposes a small HTTP API for contact flows, newsletter subscriptions, and operator actions.

## Public endpoints

### `POST /api/subscribe`

Subscribe an email address to low-frequency updates.

Request body:

```json
{
  "email": "reader@example.com"
}
```

### `POST /api/contact`

Send a direct contact request or update request to Diego.

Request body:

```json
{
  "mode": "conversation",
  "name": "Reader Name",
  "email": "reader@example.com",
  "subject": "Work with Diego",
  "message": "Context and request details."
}
```

`mode` accepts:

- `conversation`
- `updates`

### `GET /api/status`

Health and capability status for automated discovery.

## Protected endpoints

### `GET /api/subscribers`

List subscribers. Requires either:

- `X-Admin-Token`
- `Authorization: Bearer <access_token>` from the OIDC issuer published at `/.well-known/openid-configuration`

### `POST /api/send`

Send an operator message to all subscribers. Supports either a legacy admin token in the JSON payload or an `Authorization: Bearer <access_token>` header from the OIDC issuer published at `/.well-known/openid-configuration`.

Request body:

```json
{
  "token": "YOUR_ADMIN_TOKEN",
  "subject": "New essay",
  "message": "A new paper is live.",
  "url": "https://diegodella.ar/the-last-scarcity.html"
}
```

## OpenAPI

Machine-readable spec:

- `https://diegodella.ar/openapi.json`

## OAuth / OIDC discovery

- `https://diegodella.ar/.well-known/openid-configuration`
- `https://diegodella.ar/.well-known/oauth-authorization-server`
- `https://diegodella.ar/.well-known/oauth-protected-resource`
