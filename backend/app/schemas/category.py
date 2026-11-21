from pydantic import Field

from app.schemas.base import ORMModel


class CategoryBase(ORMModel):
    name: str = Field(min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=2000)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(ORMModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=2000)


class CategoryRead(CategoryBase):
    id: int

