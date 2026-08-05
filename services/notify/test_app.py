import importlib
import os
import sys
import unittest
from unittest.mock import patch


os.environ.setdefault("RESEND_API_KEY", "test-key")
sys.path.insert(0, os.path.dirname(__file__))
app_module = importlib.import_module("app")
email_service = importlib.import_module("email_service")


class ContactApiTests(unittest.TestCase):
    def setUp(self):
        self.client = app_module.app.test_client()

    def test_requires_valid_email(self):
        response = self.client.post(
            "/api/contact",
            json={"email": "invalid", "subject": "Hello", "message": "Context"},
        )
        self.assertEqual(response.status_code, 400)

    def test_rejects_oversized_input(self):
        response = self.client.post(
            "/api/contact",
            json={"email": "user@example.com", "subject": "x" * 161, "message": "Context"},
        )
        self.assertEqual(response.status_code, 400)

    @patch.object(app_module, "send_contact_email", return_value={"id": "message-id"})
    def test_sends_valid_contact_without_changing_contract(self, send):
        payload = {
            "mode": "conversation",
            "name": "Ada",
            "email": "ada@example.com",
            "subject": "Work with Diego",
            "message": "Project context",
        }
        response = self.client.post("/api/contact", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"ok": True, "id": "message-id"})
        send.assert_called_once_with("Ada", "ada@example.com", "Work with Diego", "Project context", "conversation")

    @patch.object(app_module, "send_contact_email", side_effect=RuntimeError("secret"))
    def test_hides_internal_delivery_errors(self, _send):
        response = self.client.post(
            "/api/contact",
            json={"email": "user@example.com", "subject": "Hello", "message": "Context"},
        )
        self.assertEqual(response.status_code, 500)
        self.assertNotIn("secret", response.get_data(as_text=True))


class ContactEmailTests(unittest.TestCase):
    def test_escapes_user_content_in_html_email(self):
        html = email_service.build_contact_html(
            "<b>Ada</b>",
            "ada@example.com",
            "<script>alert(1)</script>",
            "Hello <img src=x onerror=alert(1)>",
            "conversation",
        )
        self.assertNotIn("<script>", html)
        self.assertNotIn("<img", html)
        self.assertIn("&lt;b&gt;Ada&lt;/b&gt;", html)


if __name__ == "__main__":
    unittest.main()
