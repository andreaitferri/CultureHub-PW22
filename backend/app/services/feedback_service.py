from sqlalchemy.orm import Session

from app.core.exceptions import bad_request, forbidden, not_found
from app.models.feedback import Feedback
from app.repositories.booking_repository import BookingRepository
from app.repositories.event_repository import EventRepository
from app.repositories.feedback_repository import FeedbackRepository
from app.schemas.feedback import FeedbackCreate, FeedbackUpdate


class FeedbackService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = FeedbackRepository(db)
        self.events = EventRepository(db)
        self.bookings = BookingRepository(db)

    def create(self, user_id: int, payload: FeedbackCreate) -> Feedback:
        if payload.event_id is not None and not self.events.get(payload.event_id):
            raise bad_request("Event does not exist")
        if payload.booking_id is not None:
            booking = self.bookings.get(payload.booking_id)
            if not booking:
                raise bad_request("Booking does not exist")
            if booking.user_id != user_id:
                raise forbidden("You can only submit feedback for your own bookings")
        feedback = Feedback(user_id=user_id, **payload.model_dump())
        self.db.add(feedback)
        self.db.commit()
        self.db.refresh(feedback)
        return feedback

    def update(self, feedback_id: int, payload: FeedbackUpdate) -> Feedback:
        feedback = self.repo.get(feedback_id)
        if not feedback:
            raise not_found("Feedback not found")
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(feedback, key, value)
        self.db.commit()
        self.db.refresh(feedback)
        return feedback

    def delete(self, feedback_id: int) -> None:
        feedback = self.repo.get(feedback_id)
        if not feedback:
            raise not_found("Feedback not found")
        self.db.delete(feedback)
        self.db.commit()
