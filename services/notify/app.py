from flask import Flask, jsonify, request

from email_service import send_contact_email


app = Flask(__name__)


@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, X-Admin-Token"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


def is_valid_email(value):
    return bool(value and "@" in value and len(value) <= 254)


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
    if not is_valid_email(email):
        return jsonify({"error": "A valid email is required."}), 400
    if not subject:
        return jsonify({"error": "Subject is required."}), 400
    if len(subject) > 160:
        return jsonify({"error": "Subject must be 160 characters or fewer."}), 400
    if not message:
        return jsonify({"error": "Message is required."}), 400
    if len(message) > 5000:
        return jsonify({"error": "Message must be 5000 characters or fewer."}), 400
    if len(name) > 120:
        return jsonify({"error": "Name must be 120 characters or fewer."}), 400

    try:
        result = send_contact_email(name, email, subject, message, mode)
    except Exception:
        app.logger.exception("Contact email delivery failed")
        return jsonify({"error": "The contact service is unavailable. Please retry or use email."}), 500

    return jsonify({"ok": True, "id": result.get("id")}), 200


@app.route("/api/status", methods=["GET", "OPTIONS"])
def status():
    if request.method == "OPTIONS":
        return "", 204

    return jsonify(
        {
            "ok": True,
            "service": "narrative-mechanics-api",
            "version": "1.0.0",
            "endpoints": [
                "/api/status",
                "/api/contact",
            ],
        }
    ), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3100, debug=False)
