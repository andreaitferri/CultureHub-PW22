from sqlalchemy import select

from app.models.feedback import Feedback
from app.repositories.base_repository import BaseRepository


class FeedbackRepository(BaseRepository):
    def get(self, feedback_id: int) -> Feedback | None:
        return self.db.get(Feedback, feedback_id)

    def list(self) -> list[Feedback]:
        return list(self.db.scalars(select(Feedback).order_by(Feedback.id)).all())

