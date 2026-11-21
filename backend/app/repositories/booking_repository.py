from sqlalchemy import func, select

from app.models.booking import Booking
from app.repositories.base_repository import BaseRepository


class BookingRepository(BaseRepository):
    def get(self, booking_id: int) -> Booking | None:
        return self.db.get(Booking, booking_id)

    def get_for_update(self, booking_id: int) -> Booking | None:
        stmt = select(Booking).where(Booking.id == booking_id).with_for_update()
        return self.db.scalar(stmt)

    def list(self) -> list[Booking]:
        return list(self.db.scalars(select(Booking).order_by(Booking.id)).all())

    def booked_seats_for_event(self, event_id: int, exclude_booking_id: int | None = None) -> int:
        stmt = select(func.coalesce(func.sum(Booking.seats), 0)).where(
            Booking.event_id == event_id,
            Booking.status.in_(("pending", "confirmed")),
        )
        if exclude_booking_id is not None:
            stmt = stmt.where(Booking.id != exclude_booking_id)
        return int(self.db.scalar(stmt) or 0)

    def active_for_user_event(
        self,
        user_id: int,
        event_id: int,
        exclude_booking_id: int | None = None,
    ) -> Booking | None:
        stmt = select(Booking).where(
            Booking.user_id == user_id,
            Booking.event_id == event_id,
            Booking.status.in_(("pending", "confirmed")),
        )
        if exclude_booking_id is not None:
            stmt = stmt.where(Booking.id != exclude_booking_id)
        return self.db.scalar(stmt)
