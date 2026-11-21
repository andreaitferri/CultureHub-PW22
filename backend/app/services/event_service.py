from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.event import Event
from app.repositories.event_repository import EventRepository
from app.schemas.event import EventCreate, EventUpdate


class EventService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = EventRepository(db)

    def create(self, payload: EventCreate) -> Event:
        event = Event(**payload.model_dump())
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def update(self, event_id: int, payload: EventUpdate) -> Event:
        event = self.repo.get(event_id)
        if not event:
            raise not_found("Event not found")
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(event, key, value)
        self.db.commit()
        self.db.refresh(event)
        return event

    def delete(self, event_id: int) -> None:
        event = self.repo.get(event_id)
        if not event:
            raise not_found("Event not found")
        self.db.delete(event)
        self.db.commit()

