from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.database import Base, SessionLocal, engine
from app.models import Booking, Category, Event, Feedback, Role, User, Work


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        if db.query(Role).count() == 0:
            admin = Role(name="Admin")
            operatore = Role(name="Operatore")
            visitatore = Role(name="Visitatore")
            db.add_all([admin, operatore, visitatore])
            db.flush()

            db.add(
                User(
                    first_name="System",
                    last_name="Admin",
                    email="admin@culturehub.local",
                    password_hash=get_password_hash("Admin123!"),
                    role_id=admin.id,
                )
            )

            category = Category(name="Pittura", description="Opere pittoriche e collezioni museali")
            db.add(category)
            db.flush()

            db.add(
                Work(
                    title="Opera Campione",
                    author="Autore Demo",
                    description="Record iniziale per test locale",
                    image_url=None,
                    status="active",
                    category_id=category.id,
                )
            )
            db.add(
                Event(
                    title="Mostra inaugurale",
                    description="Evento demo iniziale",
                    location="Sala principale",
                    starts_at=datetime.now(timezone.utc) + timedelta(days=7),
                    ends_at=datetime.now(timezone.utc) + timedelta(days=7, hours=2),
                    capacity=50,
                    status="published",
                )
            )
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
