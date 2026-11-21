from pydantic import Field

from app.schemas.base import ORMModel


class RoleBase(ORMModel):
    name: str = Field(min_length=2, max_length=50)


class RoleCreate(RoleBase):
    pass


class RoleUpdate(RoleBase):
    pass


class RoleRead(RoleBase):
    id: int

