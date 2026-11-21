import os
import threading
import unittest
from datetime import datetime, timezone

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.database import Base
from app.models.booking import Booking
from app.models.event import Event
from app.models.role import Role
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingUpdate
from app.services.booking_service import BookingService


class BookingIntegrityTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(bind=self.engine)
        self.session_factory = sessionmaker(bind=self.engine, autocommit=False, autoflush=False)
        self.db = self.session_factory()
        role = Role(name="Visitatore")
        self.db.add(role)
        self.db.flush()
        self.user = User(
            first_name="First",
            last_name="User",
            email="first@example.com",
            password_hash="unused",
            role_id=role.id,
        )
        self.other_user = User(
            first_name="Second",
            last_name="User",
            email="second@example.com",
            password_hash="unused",
            role_id=role.id,
        )
        self.db.add_all([self.user, self.other_user])
        self.db.flush()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def add_event(self, capacity=2):
        event = Event(
            title="Integrity event",
            location="Test location",
            starts_at=datetime(2030, 1, 1, tzinfo=timezone.utc),
            ends_at=datetime(2030, 1, 1, 2, tzinfo=timezone.utc),
            capacity=capacity,
            status="published",
        )
        self.db.add(event)
        self.db.commit()
        return event

    def test_valid_booking(self):
        event = self.add_event()
        booking = BookingService(self.db).create(
            self.user.id,
            BookingCreate(event_id=event.id, seats=1),
        )
        self.assertEqual(booking.seats, 1)
        self.assertEqual(booking.status, "pending")

    def test_capacity_is_enforced(self):
        event = self.add_event(capacity=1)
        BookingService(self.db).create(self.user.id, BookingCreate(event_id=event.id, seats=1))

        with self.assertRaisesRegex(Exception, "Not enough available seats"):
            BookingService(self.db).create(
                self.other_user.id,
                BookingCreate(event_id=event.id, seats=1),
            )

    def test_active_duplicate_is_rejected(self):
        event = self.add_event()
        service = BookingService(self.db)
        service.create(self.user.id, BookingCreate(event_id=event.id, seats=1))

        with self.assertRaisesRegex(Exception, "already has an active booking"):
            service.create(self.user.id, BookingCreate(event_id=event.id, seats=1))

    def test_cancelled_booking_releases_seats(self):
        event = self.add_event(capacity=1)
        service = BookingService(self.db)
        booking = service.create(self.user.id, BookingCreate(event_id=event.id, seats=1))
        service.update(booking.id, BookingUpdate(status="cancelled"))

        replacement = service.create(
            self.other_user.id,
            BookingCreate(event_id=event.id, seats=1),
        )
        self.assertEqual(replacement.status, "pending")

    def test_update_cannot_create_overbooking(self):
        event = self.add_event(capacity=2)
        service = BookingService(self.db)
        first = service.create(self.user.id, BookingCreate(event_id=event.id, seats=1))
        service.create(self.other_user.id, BookingCreate(event_id=event.id, seats=1))

        with self.assertRaisesRegex(Exception, "Not enough available seats"):
            service.update(first.id, BookingUpdate(seats=2))


@unittest.skipUnless(
    os.getenv("CULTUREHUB_TEST_DATABASE_URL"),
    "CULTUREHUB_TEST_DATABASE_URL non configurato: test PostgreSQL concorrente non eseguito",
)
class PostgreSQLBookingConcurrencyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        url = os.environ["CULTUREHUB_TEST_DATABASE_URL"]
        cls.engine = create_engine(url, pool_pre_ping=True)
        with cls.engine.connect() as connection:
            database_name = connection.execute(text("select current_database()")).scalar_one()
        if database_name == "culturehub":
            raise RuntimeError("Il test concorrente non può usare il database culturehub reale")
        Base.metadata.create_all(bind=cls.engine)
        cls.session_factory = sessionmaker(bind=cls.engine, autocommit=False, autoflush=False)

    @classmethod
    def tearDownClass(cls):
        cls.engine.dispose()

    def test_two_bookings_for_last_seat_allow_only_one(self):
        setup = self.session_factory()
        role = Role(name=f"ConcurrencyRole{os.getpid()}")
        setup.add(role)
        setup.flush()
        first_user = User(
            first_name="Concurrent",
            last_name="One",
            email=f"concurrent-one-{os.getpid()}@example.com",
            password_hash="unused",
            role_id=role.id,
        )
        second_user = User(
            first_name="Concurrent",
            last_name="Two",
            email=f"concurrent-two-{os.getpid()}@example.com",
            password_hash="unused",
            role_id=role.id,
        )
        event = Event(
            title="Concurrent event",
            location="Test location",
            starts_at=datetime(2030, 1, 1, tzinfo=timezone.utc),
            ends_at=datetime(2030, 1, 1, 2, tzinfo=timezone.utc),
            capacity=1,
            status="published",
        )
        setup.add_all([first_user, second_user, event])
        setup.commit()
        user_ids = (first_user.id, second_user.id)
        event_id = event.id
        setup.close()

        barrier = threading.Barrier(2)
        outcomes = []

        def attempt(user_id):
            session = self.session_factory()
            try:
                barrier.wait()
                booking = BookingService(session).create(
                    user_id,
                    BookingCreate(event_id=event_id, seats=1),
                )
                outcomes.append(("success", booking.id))
            except Exception as exc:  # noqa: BLE001 - assertion records the outcome
                session.rollback()
                outcomes.append(("error", str(exc)))
            finally:
                session.close()

        threads = [threading.Thread(target=attempt, args=(user_id,)) for user_id in user_ids]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join(timeout=30)

        self.assertEqual(len(outcomes), 2)
        self.assertEqual(sum(outcome[0] == "success" for outcome in outcomes), 1)
        self.assertEqual(sum(outcome[0] == "error" for outcome in outcomes), 1)
