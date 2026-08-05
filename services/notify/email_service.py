import os
from html import escape

import requests
from dotenv import load_dotenv


load_dotenv()


RESEND_API_KEY = os.environ["RESEND_API_KEY"]
FROM_EMAIL = os.environ.get("FROM_EMAIL", "diego@diegodella.ar")
CONTACT_TO_EMAIL = os.environ.get("CONTACT_TO_EMAIL", "dellagostino@gmail.com")


def build_contact_html(name, email, subject, message, mode):
    mode_label = "Update request" if mode == "updates" else "Contact request"
    safe_name = escape(name or "Not provided")
    safe_email = escape(email or "Not provided")
    safe_subject = escape(subject)
    safe_message = escape(message).replace("\n", "<br>")
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
  {safe_subject}
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

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    return response.json()
