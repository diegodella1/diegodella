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
        app_module._rate_limit_windows.clear()
        app_module._idempotency_records.clear()
        self.client = app_module.app.test_client()

    def assert_problem(self, response, status, code):
        self.assertEqual(response.status_code, status)
        self.assertEqual(response.mimetype, "application/problem+json")
        problem = response.get_json()
        self.assertEqual(problem["status"], status)
        self.assertEqual(problem["code"], code)
        self.assertTrue(problem["type"].startswith("https://diegodella.ar/docs/problems.md#"))
        self.assertTrue(problem["title"])
        self.assertTrue(problem["detail"])
        self.assertTrue(problem["resolution"])
        self.assertEqual(problem["error"], problem["detail"])
        return problem

    def test_requires_valid_email(self):
        response = self.client.post(
            "/api/v1/contact",
            json={"email": "invalid", "subject": "Hello", "message": "Context"},
        )
        problem = self.assert_problem(response, 400, "invalid_email")
        self.assertEqual(problem["errors"], [{"field": "email", "code": "invalid_email"}])

    def test_rejects_missing_or_malformed_json(self):
        missing = self.client.post("/api/v1/contact")
        self.assert_problem(missing, 400, "invalid_json")

        malformed = self.client.post(
            "/api/v1/contact",
            data="{",
            content_type="application/json",
        )
        self.assert_problem(malformed, 400, "invalid_json")

    def test_rejects_oversized_input(self):
        response = self.client.post(
            "/api/v1/contact",
            json={"email": "user@example.com", "subject": "x" * 161, "message": "Context"},
        )
        problem = self.assert_problem(response, 400, "subject_too_long")
        self.assertEqual(problem["errors"][0]["limit"], 160)

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

    @patch.object(app_module, "send_contact_email", return_value={"id": "versioned-id"})
    def test_versioned_contact_route_uses_same_contract(self, send):
        response = self.client.post(
            "/api/v1/contact",
            json={
                "name": "Ada",
                "email": "ada@example.com",
                "subject": "Hello",
                "message": "Context",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"ok": True, "id": "versioned-id"})
        self.assertNotIn("Deprecation", response.headers)
        send.assert_called_once()

    @patch.object(app_module, "send_contact_email", return_value={"id": "stable-id"})
    def test_idempotency_key_replays_success_without_duplicate_delivery(self, send):
        payload = {
            "name": "Ada",
            "email": "ada@example.com",
            "subject": "Hello",
            "message": "Context",
        }
        headers = {"Idempotency-Key": "contact-ada-001"}
        first = self.client.post("/api/v1/contact", json=payload, headers=headers)
        replay = self.client.post("/api/v1/contact", json=payload, headers=headers)

        self.assertEqual(first.status_code, 200)
        self.assertEqual(replay.status_code, 200)
        self.assertEqual(replay.get_json(), first.get_json())
        self.assertEqual(replay.headers["Idempotency-Replayed"], "true")
        send.assert_called_once()

    @patch.object(app_module, "send_contact_email", return_value={"id": "stable-id"})
    def test_idempotency_key_rejects_different_payload(self, send):
        headers = {"Idempotency-Key": "contact-ada-002"}
        first = self.client.post(
            "/api/v1/contact",
            json={"email": "ada@example.com", "subject": "Hello", "message": "First"},
            headers=headers,
        )
        conflict = self.client.post(
            "/api/v1/contact",
            json={"email": "ada@example.com", "subject": "Hello", "message": "Different"},
            headers=headers,
        )

        self.assertEqual(first.status_code, 200)
        self.assert_problem(conflict, 409, "idempotency_key_reused")
        send.assert_called_once()

    def test_rejects_invalid_idempotency_key(self):
        response = self.client.post(
            "/api/v1/contact",
            json={"email": "ada@example.com", "subject": "Hello", "message": "Context"},
            headers={"Idempotency-Key": "contains spaces"},
        )
        self.assert_problem(response, 400, "invalid_idempotency_key")

    @patch.object(app_module, "send_contact_email", side_effect=RuntimeError("secret"))
    def test_hides_internal_delivery_errors(self, _send):
        response = self.client.post(
            "/api/contact",
            json={"email": "user@example.com", "subject": "Hello", "message": "Context"},
        )
        self.assert_problem(response, 503, "contact_delivery_unavailable")
        self.assertNotIn("secret", response.get_data(as_text=True))

    def test_unknown_api_routes_and_methods_return_problem_json(self):
        missing = self.client.get("/api/v1/orank-probe-test")
        problem = self.assert_problem(missing, 404, "not_found")
        self.assertEqual(problem["instance"], "/api/v1/orank-probe-test")

        wrong_method = self.client.get("/api/v1/contact")
        self.assert_problem(wrong_method, 405, "method_not_allowed")
        self.assertIn("POST", wrong_method.headers["Allow"])

    def test_status_advertises_version_docs_and_rate_limits(self):
        response = self.client.get("/api/v1/status")
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertEqual(payload["version"], app_module.API_VERSION)
        self.assertEqual(payload["endpoints"], ["/api/v1/status", "/api/v1/contact"])
        self.assertEqual(payload["openapi"], "https://diegodella.ar/openapi.json")
        self.assertEqual(response.headers["RateLimit-Policy"], '"public";q=120;w=60')
        self.assertRegex(response.headers["RateLimit"], r'^"public";r=119;t=\d+$')
        self.assertEqual(response.headers["RateLimit-Limit"], "120")
        self.assertEqual(response.headers["Access-Control-Allow-Headers"], "Authorization, Content-Type, Idempotency-Key, X-Admin-Token")

    def test_legacy_routes_are_deprecated_but_still_work(self):
        response = self.client.get("/api/status")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["Deprecation"], app_module.DEPRECATION_DATE)
        self.assertIn(f'<{app_module.DEPRECATION_DOC}>; rel="deprecation"', response.headers["Link"])

    def test_contact_rate_limit_returns_retryable_problem(self):
        payload = {"email": "invalid", "subject": "Hello", "message": "Context"}
        for _ in range(5):
            self.assertEqual(self.client.post("/api/v1/contact", json=payload).status_code, 400)

        limited = self.client.post("/api/v1/contact", json=payload)
        self.assert_problem(limited, 429, "rate_limit_exceeded")
        self.assertGreaterEqual(int(limited.headers["Retry-After"]), 1)
        self.assertEqual(limited.headers["RateLimit-Remaining"], "0")


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
