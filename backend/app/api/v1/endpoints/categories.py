from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.core.exceptions import not_found
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["CATEGORIES"])


@router.get("", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)):
    return CategoryService(db).repo.list()


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = CategoryService(db).repo.get(category_id)
    if not category:
        raise not_found("Category not found")
    return category


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("Admin", "Operatore"))])
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    return CategoryService(db).create(payload)


@router.put("/{category_id}", response_model=CategoryRead, dependencies=[Depends(require_role("Admin", "Operatore"))])
def update_category(category_id: int, payload: CategoryUpdate, db: Session = Depends(get_db)):
    return CategoryService(db).update(category_id, payload)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("Admin"))])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    CategoryService(db).delete(category_id)
