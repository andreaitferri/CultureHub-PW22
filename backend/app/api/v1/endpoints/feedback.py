from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db, require_role
from app.core.exceptions import not_found
from app.schemas.feedback import FeedbackCreate, FeedbackRead, FeedbackUpdate
from app.services.feedback_service import FeedbackService

router = APIRouter(prefix="/feedback", tags=["FEEDBACK"])


@router.get("", response_model=list[FeedbackRead], dependencies=[Depends(require_role("Admin", "Operatore"))])
def list_feedback(db: Session = Depends(get_db)):
    return FeedbackService(db).repo.list()


@router.get("/me", response_model=list[FeedbackRead], dependencies=[Depends(require_role("Admin", "Operatore", "Visitatore"))])
def my_feedback(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return [feedback for feedback in FeedbackService(db).repo.list() if feedback.user_id == current_user.id]


@router.get("/{feedback_id}", response_model=FeedbackRead, dependencies=[Depends(require_role("Admin", "Operatore"))])
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    feedback = FeedbackService(db).repo.get(feedback_id)
    if not feedback:
        raise not_found("Feedback not found")
    return feedback


@router.post("", response_model=FeedbackRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("Visitatore", "Admin", "Operatore"))])
def create_feedback(payload: FeedbackCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return FeedbackService(db).create(current_user.id, payload)


@router.put("/{feedback_id}", response_model=FeedbackRead, dependencies=[Depends(require_role("Admin", "Operatore"))])
def update_feedback(feedback_id: int, payload: FeedbackUpdate, db: Session = Depends(get_db)):
    return FeedbackService(db).update(feedback_id, payload)


@router.patch("/{feedback_id}/moderation", response_model=FeedbackRead, dependencies=[Depends(require_role("Admin", "Operatore"))])
def moderate_feedback(feedback_id: int, payload: FeedbackUpdate, db: Session = Depends(get_db)):
    return FeedbackService(db).update(feedback_id, payload)


@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("Admin", "Operatore"))])
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    FeedbackService(db).delete(feedback_id)
