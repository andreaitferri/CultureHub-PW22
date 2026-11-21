from sqlalchemy.orm import Session

from app.core.exceptions import bad_request, not_found
from app.models.booking import Booking
from app.repositories.booking_repository import BookingRepository
from app.repositories.event_repository import EventRepository
from app.schemas.booking import BookingCreate, BookingUpdate


class BookingService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = BookingRepository(db)
        self.events = EventRepository(db)

    def create(self, user_id: int, payload: BookingCreate) -> Booking:
        # The event row is the serialization point for all booking writes for
        # this event. PostgreSQL blocks concurrent transactions here until the
        # current transaction commits or rolls back.
        event = self.events.get_for_update(payload.event_id)
        if not event:
            raise not_found("Event not found")
        if event.status != "published":
            raise bad_request("Event not available for booking")
        if self.repo.active_for_user_event(user_id, event.id):
            raise bad_request("User already has an active booking for this event")
        already_booked = self.repo.booked_seats_for_event(event.id)
        if already_booked + payload.seats > event.capacity:
            raise bad_request("Not enough available seats")
        booking = Booking(user_id=user_id, event_id=payload.event_id, seats=payload.seats, status=payload.status)
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def update(self, booking_id: int, payload: BookingUpdate) -> Booking:
        booking = self.repo.get_for_update(booking_id)
        if not booking:
            raise not_found("Booking not found")
        data = payload.model_dump(exclude_unset=True)

        event = self.events.get_for_update(booking.event_id)
        if not event:
            raise not_found("Event not found")

        new_status = data.get("status", booking.status)
        new_seats = data.get("seats", booking.seats)
        active_statuses = ("pending", "confirmed")
        if new_status in active_statuses:
            if self.repo.active_for_user_event(
                booking.user_id,
                booking.event_id,
                exclude_booking_id=booking.id,
            ):
                raise bad_request("User already has an active booking for this event")
            already_booked = self.repo.booked_seats_for_event(
                event.id,
                exclude_booking_id=booking.id,
            )
            if already_booked + new_seats > event.capacity:
                raise bad_request("Not enough available seats")

        for key, value in data.items():
            setattr(booking, key, value)
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def delete(self, booking_id: int) -> None:
        booking = self.repo.get(booking_id)
        if not booking:
            raise not_found("Booking not found")
        self.db.delete(booking)
        self.db.commit()
