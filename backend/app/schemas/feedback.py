from datetime import datetime

from pydantic import Field, model_validator

from app.schemas.base import ORMModel


class FeedbackBase(ORMModel):
    event_id: int | None = None
    booking_id: int | None = None
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=3, max_length=4000)
    moderation_status: str = Field(default="pending", pattern="^(pending|approved|rejected)$")

    @model_validator(mode="after")
    def check_target(self):
        if self.event_id is None and self.booking_id is None:
            raise ValueError("feedback requires event_id or booking_id")
        if self.event_id is not None and self.booking_id is not None:
            raise ValueError("feedback can reference only one target")
        return self


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackUpdate(ORMModel):
    rating: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = Field(default=None, min_length=3, max_length=4000)
    moderation_status: str | None = Field(default=None, pattern="^(pending|approved|rejected)$")


class FeedbackRead(FeedbackBase):
    id: int
    user_id: int
    created_at: datetime

