from datetime import datetime

from pydantic import Field

from app.schemas.base import ORMModel


class BookingBase(ORMModel):
    event_id: int
    seats: int = Field(default=1, ge=1, le=20)
    status: str = Field(default="pending", pattern="^(pending|confirmed|cancelled|rejected)$")


class BookingCreate(BookingBase):
    pass


class BookingUpdate(ORMModel):
    seats: int | None = Field(default=None, ge=1, le=20)
    status: str | None = Field(default=None, pattern="^(pending|confirmed|cancelled|rejected)$")


class BookingRead(BookingBase):
    id: int
    user_id: int
    created_at: datetime

