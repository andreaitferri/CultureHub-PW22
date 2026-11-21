from sqlalchemy.orm import Session

from app.core.exceptions import unauthorized
from app.core.security import create_access_token, verify_password
from app.repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, db: Session):
        self.users = UserRepository(db)

    def login(self, email: str, password: str) -> str:
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.password_hash) or not user.is_active:
            raise unauthorized("Invalid credentials")
        return create_access_token(subject=user.email)

