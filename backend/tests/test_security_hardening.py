import asyncio
import unittest
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.v1.endpoints import auth, bookings, feedback, users
from app.core.dependencies import get_current_user, get_db
from app.db.database import Base
from app.middleware.errors import app_error_middleware
from app.models.booking import Booking
from app.models.event import Event
from app.models.feedback import Feedback
from app.models.role import Role
from app.models.user import User


class SecurityHardeningTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(bind=self.engine)
        self.session_factory = sessionmaker(bind=self.engine, autocommit=False, autoflush=False)
        self.db = self.session_factory()

        self.admin_role = Role(name="Admin")
        self.operator_role = Role(name="Operatore")
        self.visitor_role = Role(name="Visitatore")
        self.db.add_all([self.admin_role, self.operator_role, self.visitor_role])
        self.db.flush()

        self.visitor = User(
            first_name="Visitor",
            last_name="One",
            email="visitor@example.test",
            password_hash="unused",
            role_id=self.visitor_role.id,
        )
        self.other_visitor = User(
            first_name="Visitor",
            last_name="Two",
            email="other@example.test",
            password_hash="unused",
            role_id=self.visitor_role.id,
        )
        self.db.add_all([self.visitor, self.other_visitor])
        self.db.flush()

        self.event = Event(
            title="Test event",
            location="Test location",
            starts_at=datetime(2030, 1, 1, tzinfo=timezone.utc),
            ends_at=datetime(2030, 1, 1, 2, tzinfo=timezone.utc),
            capacity=10,
            status="published",
        )
        self.db.add(self.event)
        self.db.flush()

        self.current_user = self.visitor
        self.app = FastAPI()
        self.app.include_router(auth.router, prefix="/api/v1")
        self.app.include_router(users.router, prefix="/api/v1")
        self.app.include_router(bookings.router, prefix="/api/v1")
        self.app.include_router(feedback.router, prefix="/api/v1")

        def override_db():
            try:
                yield self.db
            finally:
                pass

        self.app.dependency_overrides[get_db] = override_db
        self.app.dependency_overrides[get_current_user] = lambda: self.current_user
        self.client = TestClient(self.app)

    def tearDown(self):
        self.client.close()
        self.db.close()
        self.engine.dispose()

    def test_public_registration_always_creates_visitor(self):
        response = self.client.post(
            "/api/v1/auth/register",
            json={
                "first_name": "New",
                "last_name": "AdminAttempt",
                "email": "attempt@example.com",
                "password": "Password123!",
                "role_id": self.admin_role.id,
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["role"]["name"], "Visitatore")
        created = self.db.scalar(select(User).where(User.email == "attempt@example.com"))
        self.assertEqual(created.role.name, "Visitatore")

    def test_public_registration_without_role_id_can_login(self):
        response = self.client.post(
            "/api/v1/auth/register",
            json={
                "first_name": "Public",
                "last_name": "Visitor",
                "email": "public@example.com",
                "password": "Password123!",
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["role"]["name"], "Visitatore")
        login = self.client.post(
            "/api/v1/auth/login",
            json={"email": "public@example.com", "password": "Password123!"},
        )
        self.assertEqual(login.status_code, 200)

    def test_feedback_rejects_booking_owned_by_another_user(self):
        booking = Booking(user_id=self.other_visitor.id, event_id=self.event.id, seats=1)
        self.db.add(booking)
        self.db.commit()

        response = self.client.post(
            "/api/v1/feedback",
            json={"booking_id": booking.id, "rating": 5, "comment": "Not allowed"},
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.db.scalar(select(Feedback)), None)

    def test_feedback_accepts_own_booking(self):
        booking = Booking(user_id=self.visitor.id, event_id=self.event.id, seats=1)
        self.db.add(booking)
        self.db.commit()

        response = self.client.post(
            "/api/v1/feedback",
            json={"booking_id": booking.id, "rating": 5, "comment": "Allowed"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["user_id"], self.visitor.id)

    def test_visitor_cannot_list_all_feedback(self):
        response = self.client.get("/api/v1/feedback")
        self.assertEqual(response.status_code, 403)

    def test_visitor_cannot_list_users_or_all_bookings(self):
        self.assertEqual(self.client.get("/api/v1/users").status_code, 403)
        self.assertEqual(self.client.get("/api/v1/bookings").status_code, 403)

    def test_internal_error_does_not_expose_exception_details(self):
        async def call_next(_request):
            raise RuntimeError("database password must not leak")

        scope = {
            "type": "http",
            "method": "GET",
            "path": "/",
            "raw_path": b"/",
            "query_string": b"",
            "headers": [],
            "scheme": "http",
            "server": ("testserver", 80),
            "client": ("testclient", 1234),
        }

        from starlette.requests import Request

        response = asyncio.run(app_error_middleware(Request(scope), call_next))
        self.assertEqual(response.status_code, 500)
        self.assertNotIn(b"database password", response.body)
        self.assertEqual(response.body, b'{"detail":"Internal server error"}')


if __name__ == "__main__":
    unittest.main()
