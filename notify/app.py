import os
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
from urllib.parse import urljoin

load_dotenv()

app = Flask(__name__)

RESEND_API_KEY = os.environ["RESEND_API_KEY"]
ADMIN_TOKEN = os.environ["ADMIN_TOKEN"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
FROM_EMAIL = os.environ.get("FROM_EMAIL", "diego@diegodella.ar")
CONTACT_TO_EMAIL = os.environ.get("CONTACT_TO_EMAIL", "dellagostino@gmail.com")
ADMIN_EMAILS = {
    item.strip().lower()
    for item in os.environ.get(
        "ADMIN_EMAILS",
        ",".join(filter(None, [FROM_EMAIL, CONTACT_TO_EMAIL]))
    ).split(",")
    if item.strip()
}


@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, X-Admin-Token"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


def get_public_auth_base():
    return f"{request.host_url.rstrip('/')}/auth/v1"


def fetch_supabase_user(access_token):
    if not access_token:
        return None

    resp = requests.get(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {access_token}",
        },
        timeout=10,
    )
    if resp.status_code != 200:
        return None
    return resp.json()


def require_operator_access(payload_token=None):
    header_token = request.headers.get("X-Admin-Token", "")
    if header_token == ADMIN_TOKEN or (payload_token and payload_token == ADMIN_TOKEN):
        return {"mode": "legacy-token"}

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    access_token = auth_header.split(" ", 1)[1].strip()
    if not access_token:
        return None

    user = fetch_supabase_user(access_token)
    if not user:
        return None

    email = (user.get("email") or "").strip().lower()
    if email and email in ADMIN_EMAILS:
        return {"mode": "oauth", "email": email}
    return None


def proxy_auth_response(path):
    upstream = f"{SUPABASE_URL}/auth/v1/{path}"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
    }
    auth_header = request.headers.get("Authorization")
    if auth_header:
        headers["Authorization"] = auth_header
    if request.headers.get("Content-Type"):
        headers["Content-Type"] = request.headers["Content-Type"]

    resp = requests.request(
        method=request.method,
        url=upstream,
        params=request.args,
        data=request.get_data() if request.method != "GET" else None,
        headers=headers,
        allow_redirects=False,
        timeout=15,
    )

    excluded = {"content-length", "connection", "content-encoding", "transfer-encoding"}
    response_headers = [
        (key, value)
        for key, value in resp.headers.items()
        if key.lower() not in excluded
    ]
    return resp.content, resp.status_code, response_headers


def build_email_html(subject, message, url):
    url_block = ""
    if url:
        url_block = f"""<tr><td style="padding-bottom:32px">
  <a href="{url}" style="display:inline-block;background:#e5e5e5;color:#0a0a0a;
     text-decoration:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:600">
    Read it
  </a>
</td></tr>"""

    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:8px;padding:36px">
<tr><td style="color:#737373;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;padding-bottom:24px">
  Narrative Mechanics
</td></tr>
<tr><td style="color:#e5e5e5;font-size:20px;font-weight:600;line-height:1.3;padding-bottom:12px">
  {subject}
</td></tr>
<tr><td style="color:#a3a3a3;font-size:15px;line-height:1.5;padding-bottom:24px;white-space:pre-wrap">
  {message}
</td></tr>
{url_block}
<tr><td style="border-top:1px solid #262626;padding-top:20px;color:#525252;font-size:12px;line-height:1.5">
  You subscribed to Narrative Mechanics.<br>
  Reply to this email to unsubscribe.
</td></tr>
</table>
</td></tr></table>
</body></html>"""


def build_email_text(subject, message, url):
    parts = [subject, "", message]
    if url:
        parts += ["", url]
    parts += ["", "---", "Reply to unsubscribe."]
    return "\n".join(parts)


def build_contact_html(name, email, subject, message, mode):
    mode_label = "Update request" if mode == "updates" else "Contact request"
    safe_name = name or "Not provided"
    safe_email = email or "Not provided"
    safe_message = message.replace("\n", "<br>")
    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:8px;padding:36px">
<tr><td style="color:#737373;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;padding-bottom:24px">
  Narrative Mechanics · {mode_label}
</td></tr>
<tr><td style="color:#e5e5e5;font-size:20px;font-weight:600;line-height:1.3;padding-bottom:16px">
  {subject}
</td></tr>
<tr><td style="color:#a3a3a3;font-size:14px;line-height:1.6;padding-bottom:20px">
  <strong style="color:#e5e5e5">Name:</strong> {safe_name}<br>
  <strong style="color:#e5e5e5">Reply to:</strong> {safe_email}
</td></tr>
<tr><td style="color:#d4d4d4;font-size:15px;line-height:1.65;white-space:pre-wrap;border-top:1px solid #262626;padding-top:20px">
  {safe_message}
</td></tr>
</table>
</td></tr></table>
</body></html>"""


def build_contact_text(name, email, subject, message, mode):
    mode_label = "Update request" if mode == "updates" else "Contact request"
    parts = [
        mode_label,
        "",
        f"Subject: {subject}",
        f"Name: {name or 'Not provided'}",
        f"Reply to: {email or 'Not provided'}",
        "",
        message,
    ]
    return "\n".join(parts)


def get_subscribers():
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/nm_subscribers?select=email,created_at&order=created_at.desc",
        headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        },
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def send_email(to, subject, message, url):
    resp = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": f"Diego Dell'Agostino <{FROM_EMAIL}>",
            "to": [to],
            "subject": subject,
            "html": build_email_html(subject, message, url),
            "text": build_email_text(subject, message, url),
        },
        timeout=15,
    )
    resp.raise_for_status()


def send_contact_email(name, email, subject, message, mode):
    payload = {
        "from": f"Narrative Mechanics <{FROM_EMAIL}>",
        "to": [CONTACT_TO_EMAIL],
        "subject": subject,
        "html": build_contact_html(name, email, subject, message, mode),
        "text": build_contact_text(name, email, subject, message, mode),
    }
    if email:
        payload["reply_to"] = email

    resp = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


@app.route("/api/subscribe", methods=["POST", "OPTIONS"])
def subscribe():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()

    if not email or "@" not in email:
        return jsonify({"error": "Valid email is required."}), 400

    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/nm_subscribers",
        headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        json={"email": email},
        timeout=10,
    )

    if resp.status_code in (200, 201):
        return jsonify({"ok": True}), 201
    elif resp.status_code == 409:
        return jsonify({"ok": True, "existing": True}), 200
    else:
        return jsonify({"error": "Failed to subscribe."}), 500


@app.route("/api/subscribers", methods=["GET", "OPTIONS"])
def subscribers():
    if request.method == "OPTIONS":
        return "", 204

    if not require_operator_access():
        return jsonify({"error": "Invalid token."}), 403

    try:
        subs = get_subscribers()
    except Exception as e:
        return jsonify({"error": f"Failed to fetch: {e}"}), 500

    return jsonify({"count": len(subs), "subscribers": subs})


@app.route("/api/send", methods=["POST", "OPTIONS"])
def send():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json(silent=True) or {}
    token = data.get("token", "")
    subject = data.get("subject", "").strip()
    message = data.get("message", "").strip()
    url = data.get("url", "").strip()

    if not require_operator_access(payload_token=token):
        return jsonify({"error": "Invalid token."}), 403

    if not subject:
        return jsonify({"error": "Subject is required."}), 400

    if not message:
        return jsonify({"error": "Message is required."}), 400

    try:
        subs = get_subscribers()
    except Exception as e:
        return jsonify({"error": f"Failed to fetch subscribers: {e}"}), 500

    if not subs:
        return jsonify({"error": "No subscribers found."}), 404

    emails = [s["email"] for s in subs]
    sent, errors = 0, []
    for email in emails:
        try:
            send_email(email, subject, message, url)
            sent += 1
        except Exception as e:
            errors.append(f"{email}: {e}")

    status = 200 if not errors else 207
    return jsonify({"sent": sent, "total": len(emails), "errors": errors}), status


@app.route("/api/contact", methods=["POST", "OPTIONS"])
def contact():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json(silent=True) or {}
    mode = (data.get("mode", "conversation") or "conversation").strip().lower()
    name = (data.get("name", "") or "").strip()
    email = (data.get("email", "") or "").strip().lower()
    subject = (data.get("subject", "") or "").strip()
    message = (data.get("message", "") or "").strip()

    if mode not in ("conversation", "updates"):
        mode = "conversation"

    if not email or "@" not in email:
        return jsonify({"error": "A valid email is required."}), 400

    if not subject:
        return jsonify({"error": "Subject is required."}), 400

    if not message:
        return jsonify({"error": "Message is required."}), 400

    subscribed = False
    if mode == "updates":
        try:
            resp = requests.post(
                f"{SUPABASE_URL}/rest/v1/nm_subscribers",
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal,resolution=merge-duplicates",
                },
                json={"email": email},
                timeout=10,
            )
            subscribed = resp.status_code in (200, 201)
        except Exception:
            subscribed = False

    try:
        result = send_contact_email(name, email, subject, message, mode)
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {e}"}), 500

    return jsonify({"ok": True, "id": result.get("id"), "subscribed": subscribed}), 200


@app.route("/api/status", methods=["GET", "OPTIONS"])
def status():
    if request.method == "OPTIONS":
        return "", 204

    return jsonify({
        "ok": True,
        "service": "narrative-mechanics-api",
        "version": "1.0.0",
        "endpoints": [
            "/api/status",
            "/api/subscribe",
            "/api/contact",
            "/api/subscribers",
            "/api/send",
        ],
    }), 200


@app.route("/auth/v1/.well-known/openid-configuration", methods=["GET", "OPTIONS"])
def oidc_openid_configuration():
    if request.method == "OPTIONS":
        return "", 204

    base = get_public_auth_base()
    return jsonify({
        "issuer": base,
        "authorization_endpoint": f"{base}/oauth/authorize",
        "token_endpoint": f"{base}/oauth/token",
        "jwks_uri": f"{base}/.well-known/jwks.json",
        "userinfo_endpoint": f"{base}/oauth/userinfo",
        "scopes_supported": ["openid", "profile", "email", "phone"],
        "response_types_supported": ["code"],
        "response_modes_supported": ["query"],
        "grant_types_supported": ["authorization_code", "refresh_token"],
        "subject_types_supported": ["public"],
        "id_token_signing_alg_values_supported": ["RS256", "HS256", "ES256"],
        "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post", "none"],
        "claims_supported": [
            "sub", "aud", "iss", "exp", "iat", "auth_time", "nonce",
            "email", "email_verified", "phone_number", "phone_number_verified",
            "name", "picture", "preferred_username", "updated_at"
        ],
        "code_challenge_methods_supported": ["S256", "plain"],
    })


@app.route("/auth/v1/.well-known/oauth-authorization-server", methods=["GET", "OPTIONS"])
def oauth_authorization_server():
    if request.method == "OPTIONS":
        return "", 204
    return oidc_openid_configuration()


@app.route("/auth/v1/.well-known/jwks.json", methods=["GET", "OPTIONS"])
def auth_jwks():
    if request.method == "OPTIONS":
        return "", 204
    return proxy_auth_response(".well-known/jwks.json")


@app.route("/auth/v1/oauth/authorize", methods=["GET", "POST", "OPTIONS"])
def auth_authorize():
    if request.method == "OPTIONS":
        return "", 204
    return proxy_auth_response("oauth/authorize")


@app.route("/auth/v1/oauth/token", methods=["POST", "OPTIONS"])
def auth_token():
    if request.method == "OPTIONS":
        return "", 204
    return proxy_auth_response("oauth/token")


@app.route("/auth/v1/oauth/userinfo", methods=["GET", "POST", "OPTIONS"])
def auth_userinfo():
    if request.method == "OPTIONS":
        return "", 204
    return proxy_auth_response("oauth/userinfo")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3100, debug=False)
