from sqlalchemy import select

from app.models.event import Event
from app.repositories.base_repository import BaseRepository


class EventRepository(BaseRepository):
    def get(self, event_id: int) -> Event | None:
        return self.db.get(Event, event_id)

    def get_for_update(self, event_id: int) -> Event | None:
        stmt = select(Event).where(Event.id == event_id).with_for_update()
        return self.db.scalar(stmt)

    def list(self) -> list[Event]:
        return list(self.db.scalars(select(Event).order_by(Event.id)).all())
