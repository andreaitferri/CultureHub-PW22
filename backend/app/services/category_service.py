from sqlalchemy.orm import Session

from app.core.exceptions import bad_request, not_found
from app.models.category import Category
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = CategoryRepository(db)

    def create(self, payload: CategoryCreate) -> Category:
        existing = next((c for c in self.repo.list() if c.name.lower() == payload.name.lower()), None)
        if existing:
            raise bad_request("Category already exists")
        category = Category(**payload.model_dump())
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def update(self, category_id: int, payload: CategoryUpdate) -> Category:
        category = self.repo.get(category_id)
        if not category:
            raise not_found("Category not found")
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(category, key, value)
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category_id: int) -> None:
        category = self.repo.get(category_id)
        if not category:
            raise not_found("Category not found")
        self.db.delete(category)
        self.db.commit()

