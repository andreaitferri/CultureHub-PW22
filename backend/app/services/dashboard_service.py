from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.category import Category
from app.models.event import Event
from app.models.feedback import Feedback
from app.models.user import User
from app.models.work import Work


class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def summary(self) -> dict[str, int]:
        return {
            "users": int(self.db.scalar(select(func.count(User.id))) or 0),
            "categories": int(self.db.scalar(select(func.count(Category.id))) or 0),
            "works": int(self.db.scalar(select(func.count(Work.id))) or 0),
            "events": int(self.db.scalar(select(func.count(Event.id))) or 0),
            "bookings": int(self.db.scalar(select(func.count(Booking.id))) or 0),
            "feedback": int(self.db.scalar(select(func.count(Feedback.id))) or 0),
        }

