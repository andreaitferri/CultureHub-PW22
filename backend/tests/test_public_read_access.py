import unittest
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.v1.endpoints import categories, catalog, events
from app.core.dependencies import get_db, get_optional_current_user
from app.db.database import Base
from app.models.category import Category
from app.models.event import Event
from app.models.role import Role
from app.models.user import User
from app.models.work import Work


class PublicReadAccessTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Base.metadata.create_all(bind=self.engine)
        self.factory = sessionmaker(bind=self.engine, autocommit=False, autoflush=False)
        self.db = self.factory()
        admin_role = Role(name="Admin")
        visitor_role = Role(name="Visitatore")
        self.db.add_all([admin_role, visitor_role])
        self.db.flush()
        self.admin = User(first_name="Admin", last_name="Test", email="public-admin@example.com", password_hash="unused", role_id=admin_role.id)
        self.db.add(self.admin)
        category = Category(name="Public category", description="Test")
        self.db.add(category)
        self.db.flush()
        self.active_work = Work(title="Public work", author="Author", category_id=category.id, status="active")
        self.archived_work = Work(title="Private archived work", author="Author", category_id=category.id, status="archived")
        self.db.add_all([self.active_work, self.archived_work])
        starts = datetime(2030, 1, 1, tzinfo=timezone.utc)
        self.published_event = Event(title="Public event", location="Room", starts_at=starts, ends_at=datetime(2030, 1, 1, 2, tzinfo=timezone.utc), capacity=10, status="published")
        self.draft_event = Event(title="Private draft event", location="Room", starts_at=starts, ends_at=datetime(2030, 1, 1, 2, tzinfo=timezone.utc), capacity=10, status="draft")
        self.db.add_all([self.published_event, self.draft_event])
        self.db.commit()

        self.app = FastAPI()
        self.app.include_router(categories.router, prefix="/api/v1")
        self.app.include_router(catalog.router, prefix="/api/v1")
        self.app.include_router(events.router, prefix="/api/v1")

        def override_db():
            yield self.db

        self.app.dependency_overrides[get_db] = override_db
        self.current_user = None
        self.app.dependency_overrides[get_optional_current_user] = lambda: self.current_user
        self.client = TestClient(self.app)

    def tearDown(self):
        self.client.close()
        self.db.close()
        self.engine.dispose()

    def test_anonymous_reads_only_publishable_content(self):
        self.assertEqual(self.client.get("/api/v1/categories").status_code, 200)
        works = self.client.get("/api/v1/catalog").json()
        events = self.client.get("/api/v1/events").json()
        self.assertEqual([item["title"] for item in works], ["Public work"])
        self.assertEqual([item["title"] for item in events], ["Public event"])
        self.assertEqual(self.client.get(f"/api/v1/catalog/{self.archived_work.id}").status_code, 404)
        self.assertEqual(self.client.get(f"/api/v1/events/{self.draft_event.id}").status_code, 404)

    def test_admin_can_read_management_states(self):
        self.current_user = self.admin
        works = self.client.get("/api/v1/catalog").json()
        events = self.client.get("/api/v1/events").json()
        self.assertEqual(len(works), 2)
        self.assertEqual(len(events), 2)

    def test_anonymous_cannot_write(self):
        self.assertEqual(self.client.post("/api/v1/categories", json={"name": "No write"}).status_code, 401)
        self.assertEqual(self.client.post("/api/v1/catalog", json={"title": "No write", "category_id": self.active_work.category_id}).status_code, 401)
        self.assertEqual(self.client.post("/api/v1/events", json={"title": "No write"}).status_code, 401)


if __name__ == "__main__":
    unittest.main()
