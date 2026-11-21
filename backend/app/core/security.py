from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt, JWTError
from app.core.config import settings
from passlib.hash import pbkdf2_sha256


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pbkdf2_sha256.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pbkdf2_sha256.hash(password)


def create_access_token(subject: str, expires_delta_minutes: int | None = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_delta_minutes or settings.access_token_expire_minutes
    )
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])


def token_subject(token: str) -> str | None:
    try:
        payload = decode_token(token)
        return payload.get("sub")
    except JWTError:
        return None
