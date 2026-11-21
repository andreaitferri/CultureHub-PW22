from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db, require_role
from app.core.exceptions import not_found
from app.schemas.booking import BookingCreate, BookingRead, BookingUpdate
from app.services.booking_service import BookingService

router = APIRouter(prefix="/bookings", tags=["BOOKINGS"])


@router.get("", response_model=list[BookingRead], dependencies=[Depends(require_role("Admin", "Operatore"))])
def list_bookings(db: Session = Depends(get_db)):
    return BookingService(db).repo.list()


@router.get("/me", response_model=list[BookingRead], dependencies=[Depends(require_role("Admin", "Operatore", "Visitatore"))])
def my_bookings(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return [booking for booking in BookingService(db).repo.list() if booking.user_id == current_user.id]


@router.get("/{booking_id}", response_model=BookingRead, dependencies=[Depends(require_role("Admin", "Operatore"))])
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = BookingService(db).repo.get(booking_id)
    if not booking:
        raise not_found("Booking not found")
    return booking


@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("Visitatore", "Admin", "Operatore"))])
def create_booking(payload: BookingCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return BookingService(db).create(current_user.id, payload)


@router.put("/{booking_id}", response_model=BookingRead, dependencies=[Depends(require_role("Admin", "Operatore"))])
def update_booking(booking_id: int, payload: BookingUpdate, db: Session = Depends(get_db)):
    return BookingService(db).update(booking_id, payload)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("Admin", "Operatore"))])
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    BookingService(db).delete(booking_id)
