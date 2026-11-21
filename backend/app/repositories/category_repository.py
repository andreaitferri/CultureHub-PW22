from sqlalchemy import select

from app.models.category import Category
from app.repositories.base_repository import BaseRepository


class CategoryRepository(BaseRepository):
    def get(self, category_id: int) -> Category | None:
        return self.db.get(Category, category_id)

    def list(self) -> list[Category]:
        return list(self.db.scalars(select(Category).order_by(Category.id)).all())

