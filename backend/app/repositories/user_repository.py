from sqlalchemy import select

from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository):
    def get_by_email(self, email: str) -> User | None:
        return self.db.scalar(select(User).where(User.email == email))

    def get(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def list(self) -> list[User]:
        return list(self.db.scalars(select(User).order_by(User.id)).all())

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

