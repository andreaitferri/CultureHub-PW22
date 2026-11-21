from collections.abc import Generator

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.exceptions import unauthorized, forbidden
from app.core.security import decode_token
from app.db.database import SessionLocal
from app.models.user import User
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_token(token)
        email = payload.get("sub")
        if not email:
            raise unauthorized()
    except Exception as exc:
        raise unauthorized() from exc
    user = UserRepository(db).get_by_email(email)
    if not user:
        raise unauthorized()
    return user


def get_optional_current_user(
    token: str | None = Depends(optional_oauth2_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    if not token:
        return None
    try:
        payload = decode_token(token)
        email = payload.get("sub")
        if not email:
            return None
    except Exception:
        return None
    return UserRepository(db).get_by_email(email)


def require_role(*allowed_roles: str):
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role.name not in allowed_roles:
            raise forbidden()
        return user

    return dependency
