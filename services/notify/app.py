import hashlib
import json
import math
import threading
import time

from flask import Flask, g, jsonify, request

from email_service import send_contact_email


app = Flask(__name__)

API_VERSION = "1.2.0"
DEPRECATION_DATE = "@1787356800"
DEPRECATION_DOC = "https://diegodella.ar/developers.html#versioning"
LEGACY_PATHS = {"/api/contact", "/api/status"}
RATE_LIMITS = {
    "contact": {"quota": 5, "window": 3600},
    "public": {"quota": 120, "window": 60},
}
_rate_limit_lock = threading.Lock()
_rate_limit_windows = {}
_idempotency_lock = threading.Lock()
_idempotency_records = {}
IDEMPOTENCY_TTL = 86400


def problem_response(status, code, title, detail, resolution, *, errors=None):
    """Return an RFC 9457 problem document with stable agent-facing hints."""
    payload = {
        "type": f"https://diegodella.ar/docs/problems.md#{code}",
        "title": title,
        "status": status,
        "detail": detail,
        "instance": request.path,
        "code": code,
        "resolution": resolution,
        # Preserve the browser contact form's existing error-message contract.
        "error": detail,
    }
    if errors:
        payload["errors"] = errors

    response = jsonify(payload)
    response.status_code = status
    response.content_type = "application/problem+json"
    return response


def _rate_limit_policy():
    is_contact_write = request.method == "POST" and request.path in {
        "/api/contact",
        "/api/v1/contact",
    }
    return "contact" if is_contact_write else "public"


def _client_partition():
    # Nginx replaces X-Real-IP at the trusted proxy boundary.
    return request.headers.get("X-Real-IP") or request.remote_addr or "unknown"


@app.before_request
def enforce_api_rate_limit():
    if not request.path.startswith("/api/"):
        return None

    policy_name = _rate_limit_policy()
    policy = RATE_LIMITS[policy_name]
    quota = policy["quota"]
    window = policy["window"]
    now = time.monotonic()
    key = (policy_name, _client_partition())

    with _rate_limit_lock:
        started_at, used = _rate_limit_windows.get(key, (now, 0))
        if now - started_at >= window:
            started_at, used = now, 0

        reset_after = max(1, math.ceil(window - (now - started_at)))
        if request.method != "OPTIONS" and used >= quota:
            remaining = 0
            blocked = True
        else:
            if request.method != "OPTIONS":
                used += 1
                _rate_limit_windows[key] = (started_at, used)
            remaining = max(0, quota - used)
            blocked = False

        # Bound stale in-memory partitions without adding a database dependency.
        if len(_rate_limit_windows) > 1000:
            stale_before = now - max(item["window"] for item in RATE_LIMITS.values())
            stale = [bucket for bucket, (start, _used) in _rate_limit_windows.items() if start < stale_before]
            for bucket in stale:
                _rate_limit_windows.pop(bucket, None)

    g.rate_limit = {
        "name": policy_name,
        "quota": quota,
        "window": window,
        "remaining": remaining,
        "reset_after": reset_after,
    }

    if blocked:
        response = problem_response(
            429,
            "rate_limit_exceeded",
            "Too Many Requests",
            f"The {policy_name} request quota is exhausted for this client.",
            f"Retry after {reset_after} seconds and reduce request frequency.",
        )
        response.headers["Retry-After"] = str(reset_after)
        return response

    return None


@app.after_request
def add_api_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Idempotency-Key, X-Admin-Token"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"

    rate_limit = getattr(g, "rate_limit", None)
    if rate_limit:
        name = rate_limit["name"]
        quota = rate_limit["quota"]
        window = rate_limit["window"]
        remaining = rate_limit["remaining"]
        reset_after = rate_limit["reset_after"]
        # Current IETF HTTPAPI draft fields.
        response.headers["RateLimit-Policy"] = f'"{name}";q={quota};w={window}'
        response.headers["RateLimit"] = f'"{name}";r={remaining};t={reset_after}'
        # Widely deployed draft-03 compatibility fields.
        response.headers["RateLimit-Limit"] = str(quota)
        response.headers["RateLimit-Remaining"] = str(remaining)
        response.headers["RateLimit-Reset"] = str(reset_after)

    if request.path in LEGACY_PATHS:
        response.headers["Deprecation"] = DEPRECATION_DATE
        response.headers.add(
            "Link",
            f'<{DEPRECATION_DOC}>; rel="deprecation"; type="text/html"',
        )
    return response


def is_valid_email(value):
    return bool(value and "@" in value and len(value) <= 254)


def _valid_idempotency_key(value):
    return bool(value and len(value) <= 200 and all(0x21 <= ord(character) <= 0x7E for character in value))


def _contact_fingerprint(mode, name, email, subject, message):
    canonical = json.dumps(
        {
            "email": email,
            "message": message,
            "mode": mode,
            "name": name,
            "subject": subject,
        },
        ensure_ascii=False,
        separators=(",", ":"),
        sort_keys=True,
    )
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def _reserve_idempotency_key(value, fingerprint):
    cache_key = ("contact", _client_partition(), value)
    now = time.monotonic()
    with _idempotency_lock:
        stale = [key for key, record in _idempotency_records.items() if record["expires_at"] <= now]
        for key in stale:
            _idempotency_records.pop(key, None)

        existing = _idempotency_records.get(cache_key)
        if existing:
            if existing["fingerprint"] != fingerprint:
                return "conflict", cache_key, None
            if existing["state"] == "complete":
                return "replay", cache_key, existing["payload"]
            return "pending", cache_key, None

        _idempotency_records[cache_key] = {
            "expires_at": now + IDEMPOTENCY_TTL,
            "fingerprint": fingerprint,
            "state": "pending",
        }
        return "reserved", cache_key, None


def _release_idempotency_key(cache_key):
    if not cache_key:
        return
    with _idempotency_lock:
        if _idempotency_records.get(cache_key, {}).get("state") == "pending":
            _idempotency_records.pop(cache_key, None)


def _complete_idempotency_key(cache_key, payload):
    if not cache_key:
        return
    with _idempotency_lock:
        record = _idempotency_records.get(cache_key)
        if record:
            record.update({"state": "complete", "payload": payload})


@app.route("/api/contact", methods=["POST", "OPTIONS"])
@app.route("/api/v1/contact", methods=["POST", "OPTIONS"])
def contact():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return problem_response(
            400,
            "invalid_json",
            "Invalid JSON",
            "The request body must be a valid JSON object.",
            "Send Content-Type: application/json and a JSON object matching the OpenAPI ContactRequest schema.",
        )

    mode = (data.get("mode", "conversation") or "conversation").strip().lower()
    name = (data.get("name", "") or "").strip()
    email = (data.get("email", "") or "").strip().lower()
    subject = (data.get("subject", "") or "").strip()
    message = (data.get("message", "") or "").strip()

    if mode not in ("conversation", "updates"):
        mode = "conversation"
    if not is_valid_email(email):
        return problem_response(
            400,
            "invalid_email",
            "Invalid contact request",
            "A valid email is required.",
            "Provide an email address containing @ with at most 254 characters.",
            errors=[{"field": "email", "code": "invalid_email"}],
        )
    if not subject:
        return problem_response(
            400,
            "subject_required",
            "Invalid contact request",
            "Subject is required.",
            "Provide a non-empty subject with at most 160 characters.",
            errors=[{"field": "subject", "code": "required"}],
        )
    if len(subject) > 160:
        return problem_response(
            400,
            "subject_too_long",
            "Invalid contact request",
            "Subject must be 160 characters or fewer.",
            "Shorten subject to 160 characters or fewer.",
            errors=[{"field": "subject", "code": "max_length", "limit": 160}],
        )
    if not message:
        return problem_response(
            400,
            "message_required",
            "Invalid contact request",
            "Message is required.",
            "Provide a non-empty message with at most 5000 characters.",
            errors=[{"field": "message", "code": "required"}],
        )
    if len(message) > 5000:
        return problem_response(
            400,
            "message_too_long",
            "Invalid contact request",
            "Message must be 5000 characters or fewer.",
            "Shorten message to 5000 characters or fewer.",
            errors=[{"field": "message", "code": "max_length", "limit": 5000}],
        )
    if len(name) > 120:
        return problem_response(
            400,
            "name_too_long",
            "Invalid contact request",
            "Name must be 120 characters or fewer.",
            "Shorten name to 120 characters or fewer.",
            errors=[{"field": "name", "code": "max_length", "limit": 120}],
        )

    idempotency_key = request.headers.get("Idempotency-Key")
    reservation_key = None
    if idempotency_key is not None:
        if not _valid_idempotency_key(idempotency_key):
            return problem_response(
                400,
                "invalid_idempotency_key",
                "Invalid idempotency key",
                "Idempotency-Key must contain 1 to 200 visible ASCII characters without spaces.",
                "Send one stable opaque key for retries of the same contact request, or omit the header.",
            )

        state, reservation_key, replay_payload = _reserve_idempotency_key(
            idempotency_key,
            _contact_fingerprint(mode, name, email, subject, message),
        )
        if state == "conflict":
            return problem_response(
                409,
                "idempotency_key_reused",
                "Idempotency key reused",
                "This Idempotency-Key was already used with a different contact request.",
                "Use the original request payload or send a new unique Idempotency-Key.",
            )
        if state == "pending":
            return problem_response(
                409,
                "idempotency_request_in_progress",
                "Idempotent request in progress",
                "A matching contact request is still being processed.",
                "Wait briefly, then retry the same payload with the same Idempotency-Key.",
            )
        if state == "replay":
            response = jsonify(replay_payload)
            response.headers["Idempotency-Replayed"] = "true"
            return response, 200

    try:
        result = send_contact_email(name, email, subject, message, mode)
    except Exception:
        _release_idempotency_key(reservation_key)
        app.logger.exception("Contact email delivery failed")
        return problem_response(
            503,
            "contact_delivery_unavailable",
            "Contact delivery unavailable",
            "The contact service is unavailable.",
            "Retry later or email dellagostino@gmail.com directly.",
        )

    payload = {"ok": True, "id": result.get("id")}
    _complete_idempotency_key(reservation_key, payload)
    return jsonify(payload), 200


@app.route("/api/status", methods=["GET", "OPTIONS"])
@app.route("/api/v1/status", methods=["GET", "OPTIONS"])
def status():
    if request.method == "OPTIONS":
        return "", 204

    return jsonify(
        {
            "ok": True,
            "service": "narrative-mechanics-api",
            "version": API_VERSION,
            "endpoints": [
                "/api/v1/status",
                "/api/v1/contact",
            ],
            "documentation": "https://diegodella.ar/developers.html",
            "openapi": "https://diegodella.ar/openapi.json",
        }
    ), 200


@app.errorhandler(404)
def not_found(error):
    if request.path.startswith("/api/"):
        return problem_response(
            404,
            "not_found",
            "Not Found",
            f"No API operation exists at {request.path}.",
            "Read https://diegodella.ar/openapi.json or https://diegodella.ar/developers.html for supported operations.",
        )
    return error


@app.errorhandler(405)
def method_not_allowed(error):
    if request.path.startswith("/api/"):
        allowed = sorted(error.valid_methods or [])
        response = problem_response(
            405,
            "method_not_allowed",
            "Method Not Allowed",
            f"{request.method} is not allowed for {request.path}.",
            f"Retry with one of these methods: {', '.join(allowed)}.",
        )
        if allowed:
            response.headers["Allow"] = ", ".join(allowed)
        return response
    return error


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3100, debug=False)
