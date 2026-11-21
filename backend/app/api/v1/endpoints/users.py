from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.core.exceptions import not_found
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["USERS"])


@router.get("", response_model=list[UserRead], dependencies=[Depends(require_role("Admin"))])
def list_users(db: Session = Depends(get_db)):
    return UserService(db).users.list()


@router.get("/{user_id}", response_model=UserRead, dependencies=[Depends(require_role("Admin"))])
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = UserService(db).users.get(user_id)
    if not user:
        raise not_found("User not found")
    return user


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("Admin"))])
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    return UserService(db).create(payload)


@router.put("/{user_id}", response_model=UserRead, dependencies=[Depends(require_role("Admin"))])
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    return UserService(db).update(user_id, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("Admin"))])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    UserService(db).delete(user_id)
