# DiegoDella API problem types

The DiegoDella Public API returns errors as `application/problem+json` documents following RFC 9457. Every problem includes `type`, `title`, `status`, `detail`, `instance`, a stable `code`, and a concrete `resolution`. The `error` member mirrors `detail` only for backward compatibility with the existing browser contact form.

## `invalid_json`

HTTP 400. Request body is missing, malformed, or not a JSON object. Send `Content-Type: application/json` and follow the `ContactRequest` schema in `/openapi.json`.

## Contact validation codes

HTTP 400. `invalid_email`, `subject_required`, `subject_too_long`, `message_required`, `message_too_long`, and `name_too_long` identify the field correction needed. The optional `errors` array names affected fields and limits.

## `not_found`

HTTP 404. Requested API path does not exist. Read `/openapi.json` or `/developers.html` and retry with a documented path.

## `method_not_allowed`

HTTP 405. Requested path exists but does not accept that HTTP method. Read the `Allow` header and retry with a listed method.

## Idempotency codes

- `invalid_idempotency_key` — HTTP 400. Use 1–200 visible ASCII characters without spaces, or omit the header.
- `idempotency_key_reused` — HTTP 409. The key belongs to different contact data. Restore the original payload or create a new key.
- `idempotency_request_in_progress` — HTTP 409. The matching request is still processing. Wait briefly, then retry the same payload and key.

## `rate_limit_exceeded`

HTTP 429. Client quota is exhausted. Honor `Retry-After`, `RateLimit`, and `RateLimit-Policy` before retrying.

## `contact_delivery_unavailable`

HTTP 503. Email delivery failed temporarily. Retry later or email `dellagostino@gmail.com` directly.
