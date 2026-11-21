from sqlalchemy import select

from app.models.role import Role
from app.repositories.base_repository import BaseRepository


class RoleRepository(BaseRepository):
    def get_by_name(self, name: str) -> Role | None:
        return self.db.scalar(select(Role).where(Role.name == name))

    def get(self, role_id: int) -> Role | None:
        return self.db.get(Role, role_id)

    def list(self) -> list[Role]:
        return list(self.db.scalars(select(Role).order_by(Role.id)).all())

