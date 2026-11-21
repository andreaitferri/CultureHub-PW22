from sqlalchemy.orm import Session

from app.core.exceptions import bad_request, not_found
from app.models.work import Work
from app.repositories.category_repository import CategoryRepository
from app.repositories.work_repository import WorkRepository
from app.schemas.work import WorkCreate, WorkUpdate


class WorkService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = WorkRepository(db)
        self.categories = CategoryRepository(db)

    def create(self, payload: WorkCreate) -> Work:
        if not self.categories.get(payload.category_id):
            raise bad_request("Category does not exist")
        work = Work(**payload.model_dump())
        self.db.add(work)
        self.db.commit()
        self.db.refresh(work)
        return work

    def update(self, work_id: int, payload: WorkUpdate) -> Work:
        work = self.repo.get(work_id)
        if not work:
            raise not_found("Work not found")
        data = payload.model_dump(exclude_unset=True)
        if "category_id" in data and not self.categories.get(data["category_id"]):
            raise bad_request("Category does not exist")
        for key, value in data.items():
            setattr(work, key, value)
        self.db.commit()
        self.db.refresh(work)
        return work

    def delete(self, work_id: int) -> None:
        work = self.repo.get(work_id)
        if not work:
            raise not_found("Work not found")
        self.db.delete(work)
        self.db.commit()

