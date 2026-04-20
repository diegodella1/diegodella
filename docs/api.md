# Narrative Mechanics API

Base URL: `https://diegodella.ar`

This site exposes a small HTTP API for the contact flow.

## Public endpoints

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

## OpenAPI

Machine-readable spec:

- `https://diegodella.ar/openapi.json`
