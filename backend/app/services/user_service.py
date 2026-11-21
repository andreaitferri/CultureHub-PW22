from sqlalchemy.orm import Session

from app.core.exceptions import bad_request, not_found
from app.core.security import get_password_hash
from app.models.user import User
from app.repositories.role_repository import RoleRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import PublicUserCreate, UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.users = UserRepository(db)
        self.roles = RoleRepository(db)

    def create(self, payload: UserCreate | PublicUserCreate, role_name: str | None = None) -> User:
        if self.users.get_by_email(payload.email):
            raise bad_request("Email already exists")
        role = self.roles.get_by_name(role_name) if role_name else self.roles.get(payload.role_id)
        if not role:
            raise bad_request("Role does not exist")
        user = User(
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=payload.email,
            password_hash=get_password_hash(payload.password),
            role_id=role.id,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user_id: int, payload: UserUpdate) -> User:
        user = self.users.get(user_id)
        if not user:
            raise not_found("User not found")
        data = payload.model_dump(exclude_unset=True)
        if "email" in data and data["email"] != user.email and self.users.get_by_email(data["email"]):
            raise bad_request("Email already exists")
        if "role_id" in data and not self.roles.get(data["role_id"]):
            raise bad_request("Role does not exist")
        if "password" in data:
            data["password_hash"] = get_password_hash(data.pop("password"))
        for key, value in data.items():
            setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user_id: int) -> None:
        user = self.users.get(user_id)
        if not user:
            raise not_found("User not found")
        self.db.delete(user)
        self.db.commit()
