from sqlalchemy import select

from app.models.work import Work
from app.repositories.base_repository import BaseRepository


class WorkRepository(BaseRepository):
    def get(self, work_id: int) -> Work | None:
        return self.db.get(Work, work_id)

    def list(self) -> list[Work]:
        return list(self.db.scalars(select(Work).order_by(Work.id)).all())

