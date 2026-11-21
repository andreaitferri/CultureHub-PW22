from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import PublicUserCreate, UserRead
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["AUTH"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token = AuthService(db).login(payload.email, payload.password)
    return Token(access_token=token)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: PublicUserCreate, db: Session = Depends(get_db)):
    return UserService(db).create(payload, role_name="Visitatore")


@router.get("/me", response_model=UserRead)
def me(current_user=Depends(get_current_user)):
    return current_user
