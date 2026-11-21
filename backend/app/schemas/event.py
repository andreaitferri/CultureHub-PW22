from datetime import datetime

from pydantic import Field, field_validator

from app.schemas.base import ORMModel


class EventBase(ORMModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = None
    location: str = Field(min_length=2, max_length=255)
    starts_at: datetime
    ends_at: datetime
    capacity: int = Field(ge=1, le=100000)
    status: str = Field(default="draft", pattern="^(draft|published|cancelled|completed)$")

    @field_validator("ends_at")
    @classmethod
    def ends_after_start(cls, value, info):
        start = info.data.get("starts_at")
        if start and value <= start:
            raise ValueError("ends_at must be after starts_at")
        return value


class EventCreate(EventBase):
    pass


class EventUpdate(ORMModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    location: str | None = Field(default=None, min_length=2, max_length=255)
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    capacity: int | None = Field(default=None, ge=1, le=100000)
    status: str | None = Field(default=None, pattern="^(draft|published|cancelled|completed)$")


class EventRead(EventBase):
    id: int

