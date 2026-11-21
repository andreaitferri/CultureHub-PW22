from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["DASHBOARD"])


@router.get("/summary", dependencies=[Depends(require_role("Admin"))])
def summary(db: Session = Depends(get_db)):
    return DashboardService(db).summary()

