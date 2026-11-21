from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_optional_current_user, require_role
from app.core.exceptions import not_found
from app.schemas.work import WorkCreate, WorkRead, WorkUpdate
from app.services.work_service import WorkService

router = APIRouter(prefix="/catalog", tags=["CATALOG"])


@router.get("", response_model=list[WorkRead])
def list_works(current_user=Depends(get_optional_current_user), db: Session = Depends(get_db)):
    works = WorkService(db).repo.list()
    if current_user is None or current_user.role.name == "Visitatore":
        return [work for work in works if work.status == "active"]
    return works


@router.get("/{work_id}", response_model=WorkRead)
def get_work(work_id: int, current_user=Depends(get_optional_current_user), db: Session = Depends(get_db)):
    work = WorkService(db).repo.get(work_id)
    if not work or (work.status != "active" and (current_user is None or current_user.role.name == "Visitatore")):
        raise not_found("Work not found")
    return work


@router.post("", response_model=WorkRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("Admin", "Operatore"))])
def create_work(payload: WorkCreate, db: Session = Depends(get_db)):
    return WorkService(db).create(payload)


@router.put("/{work_id}", response_model=WorkRead, dependencies=[Depends(require_role("Admin", "Operatore"))])
def update_work(work_id: int, payload: WorkUpdate, db: Session = Depends(get_db)):
    return WorkService(db).update(work_id, payload)


@router.delete("/{work_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("Admin"))])
def delete_work(work_id: int, db: Session = Depends(get_db)):
    WorkService(db).delete(work_id)
