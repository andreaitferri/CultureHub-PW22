from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_optional_current_user, require_role
from app.core.exceptions import not_found
from app.schemas.event import EventCreate, EventRead, EventUpdate
from app.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["EVENTS"])


@router.get("", response_model=list[EventRead])
def list_events(current_user=Depends(get_optional_current_user), db: Session = Depends(get_db)):
    events = EventService(db).repo.list()
    if current_user is None or current_user.role.name == "Visitatore":
        return [event for event in events if event.status == "published"]
    return events


@router.get("/{event_id}", response_model=EventRead)
def get_event(event_id: int, current_user=Depends(get_optional_current_user), db: Session = Depends(get_db)):
    event = EventService(db).repo.get(event_id)
    if not event or (event.status != "published" and (current_user is None or current_user.role.name == "Visitatore")):
        raise not_found("Event not found")
    return event


@router.post("", response_model=EventRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("Admin", "Operatore"))])
def create_event(payload: EventCreate, db: Session = Depends(get_db)):
    return EventService(db).create(payload)


@router.put("/{event_id}", response_model=EventRead, dependencies=[Depends(require_role("Admin", "Operatore"))])
def update_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db)):
    return EventService(db).update(event_id, payload)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("Admin"))])
def delete_event(event_id: int, db: Session = Depends(get_db)):
    EventService(db).delete(event_id)
