from pydantic import Field

from app.schemas.base import ORMModel
from app.schemas.category import CategoryRead


class WorkBase(ORMModel):
    title: str = Field(min_length=2, max_length=200)
    author: str | None = Field(default=None, max_length=200)
    description: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    status: str = Field(default="active", pattern="^(active|archived)$")
    category_id: int


class WorkCreate(WorkBase):
    pass


class WorkUpdate(ORMModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    author: str | None = Field(default=None, max_length=200)
    description: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    status: str | None = Field(default=None, pattern="^(active|archived)$")
    category_id: int | None = None


class WorkRead(WorkBase):
    id: int
    category: CategoryRead
