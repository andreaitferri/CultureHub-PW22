"""Populate the isolated CultureHub demonstration database.

Usage:
    CULTUREHUB_TEST_DATABASE_URL='postgresql+psycopg2://...' \
    CULTUREHUB_DEMO_PASSWORD='...' python scripts/seed_demo_test.py

The script refuses to run against any database other than culturehub_test,
does not create schema, and only inserts missing deterministic records.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
import os
from pathlib import Path
import sys

from sqlalchemy import inspect, select, text
from pydantic import EmailStr, TypeAdapter

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

TEST_DATABASE_URL = os.getenv("CULTUREHUB_TEST_DATABASE_URL")
DEMO_PASSWORD = os.getenv("CULTUREHUB_DEMO_PASSWORD")
EMAIL_DOMAIN = os.getenv("CULTUREHUB_DEMO_EMAIL_DOMAIN", "example.com")
EMAIL_VALIDATOR = TypeAdapter(EmailStr)

if not TEST_DATABASE_URL:
    raise SystemExit("CULTUREHUB_TEST_DATABASE_URL must be configured")
if not DEMO_PASSWORD:
    raise SystemExit("CULTUREHUB_DEMO_PASSWORD must be configured")

os.environ["DATABASE_URL"] = TEST_DATABASE_URL

from sqlalchemy.orm import Session  # noqa: E402

from app.core.security import get_password_hash  # noqa: E402
from app.db.database import Base, SessionLocal, engine  # noqa: E402
from app.models import Booking, Category, Event, Feedback, Role, User, Work  # noqa: E402


CATEGORIES = [
    ("Pittura", "Dipinti, tele e ricerche cromatiche della tradizione italiana."),
    ("Scultura", "Forme tridimensionali tra materia, spazio e memoria."),
    ("Fotografia", "Sguardi documentari e poetici sul paesaggio contemporaneo."),
    ("Design", "Progetti italiani tra funzione, industria e cultura del progetto."),
    ("Arti digitali", "Installazioni e opere nate dall’incontro tra arte e tecnologia."),
    ("Patrimonio storico", "Manufatti e testimonianze della storia culturale italiana."),
]

WORKS = [
    ("Luce sulla laguna", "Elena Ferri", "Una veduta sospesa tra acqua e architettura, costruita su velature d’avorio.", 0),
    ("Ritratto in terracotta", "Marco Bellini", "Il volto umano diventa superficie materica e racconto familiare.", 0),
    ("Orizzonte d’inverno", "Giulia Serra", "Campi chiari e linee essenziali restituiscono il silenzio della pianura.", 0),
    ("Studio per una piazza", "Luca Moretti", "Un paesaggio urbano immaginato come luogo di incontro e ascolto.", 0),
    ("Figure in dialogo", "Anna Rinaldi", "Due presenze cromatiche articolano un dialogo intimo e misurato.", 0),
    ("Materia sospesa", "Paolo Neri", "Una ricerca pittorica sul rapporto tra peso, luce e movimento.", 0),
    ("Forma del vento", "Sofia Conti", "Una scultura in equilibrio racconta la leggerezza attraverso il metallo.", 1),
    ("Custode del giardino", "Andrea Valenti", "Una figura silenziosa dedicata alla memoria dei luoghi verdi.", 1),
    ("Arco e ombra", "Marta Galli", "Geometrie scultoree dialogano con la luce naturale dello spazio espositivo.", 1),
    ("Atlante domestico", "Davide Orsi", "Oggetti quotidiani trasformati in una piccola mappa della memoria.", 1),
    ("Roma, ore sette", "Chiara De Angelis", "Una serie fotografica attraversa la città prima dell’inizio del giorno.", 2),
    ("Paesaggi minimi", "Fabio Riva", "Dettagli di territorio compongono un archivio visivo dell’Italia interna.", 2),
    ("La strada e il mare", "Irene Costa", "Un viaggio fotografico lungo le coste e le comunità del Mediterraneo.", 2),
    ("Archivio della luce", "Tommaso Villa", "Fotografie analogiche dedicate alle variazioni della luce nelle città.", 2),
    ("Sedia per l’attesa", "Nadia Romano", "Un oggetto d’uso quotidiano pensato per accogliere il tempo lento.", 3),
    ("Tavolo comune", "Enrico Sala", "Design e convivialità si incontrano in una struttura essenziale.", 3),
    ("Segni d’uso", "Valeria Bassi", "Una collezione di utensili ripensati come tracce di vita condivisa.", 3),
    ("Forma quotidiana", "Matteo Fabbri", "Una riflessione sulla bellezza silenziosa degli oggetti funzionali.", 3),
    ("Archivio orbitale", "Noemi Pini", "Un ambiente digitale esplora le relazioni tra corpo, dati e percezione.", 4),
    ("Soglia virtuale", "Riccardo Fontana", "Un’opera interattiva invita il pubblico a ridefinire il proprio punto di vista.", 4),
    ("Atlante delle connessioni", "Sara Leone", "Mappe generative raccontano le reti invisibili della società contemporanea.", 4),
    ("Memoria aumentata", "Giorgio Testa", "Immagini e suoni costruiscono un archivio digitale in continua trasformazione.", 4),
    ("Maiolica del viaggio", "Teresa Bianchi", "Un manufatto decorato raccoglie simboli e rotte del Mediterraneo.", 5),
    ("Libro delle corporazioni", "Pietro Guidi", "Una testimonianza documentaria del lavoro e delle comunità cittadine.", 5),
    ("Frammento di palazzo", "Laura Santi", "Un dettaglio architettonico restituisce la stratificazione della storia urbana.", 5),
    ("Canto popolare", "Michele Rosi", "Un oggetto della tradizione orale diventa memoria condivisa e materiale.", 5),
    ("Carta del territorio", "Beatrice Longo", "Un percorso tra cartografia storica, paesaggio e identità locale.", 5),
]

EVENTS = [
    ("Conversazioni sulla materia", "Un incontro tra artisti e curatori sul rapporto tra gesto e materia.", "Sala delle Colonne", 7, 60, "published"),
    ("Visita guidata: forme italiane", "Un percorso tra pittura, scultura e design del Novecento.", "Ingresso principale", 14, 40, "published"),
    ("Laboratorio di fotografia", "Un laboratorio pratico dedicato alla lettura del paesaggio urbano.", "Atelier fotografico", 21, 18, "published"),
    ("Serata digitale", "Installazioni, suoni e immagini per una serata dedicata alle arti digitali.", "Corte interna", 28, 80, "published"),
    ("Design per la comunità", "Progetti e pratiche per ripensare gli spazi condivisi.", "Auditorium", 35, 70, "published"),
    ("Patrimonio e nuove generazioni", "Un dialogo sul futuro della tutela e della divulgazione.", "Biblioteca", 42, 50, "published"),
    ("Domenica al museo", "Una giornata di attività per famiglie e giovani visitatori.", "Sale del museo", 49, 100, "published"),
    ("Incontro con l’artista", "Elena Ferri presenta la serie Luce sulla laguna.", "Sala proiezioni", 56, 45, "published"),
    ("Notturno contemporaneo", "Apertura serale con musica, visite e performance.", "Corte interna", 63, 120, "published"),
    ("Fotografia e memoria", "Un seminario sul valore documentario dell’immagine.", "Aula studio", 70, 35, "published"),
    ("Giornata del restauro", "Dimostrazioni e conversazioni sulle tecniche di conservazione.", "Laboratorio del museo", 77, 30, "published"),
    ("Archivio aperto", "Documenti, mappe e materiali storici raccontano il territorio.", "Archivio", 84, 25, "published"),
    ("Evento in preparazione", "Appuntamento riservato alla programmazione interna.", "Sala riservata", 91, 20, "draft"),
    ("Mostra conclusa", "Evento dimostrativo non più prenotabile.", "Sala storica", -30, 20, "completed"),
]


def get_or_create(db: Session, model, lookup: dict, values: dict):
    instance = db.scalar(select(model).filter_by(**lookup))
    if instance is None:
        instance = model(**values)
        db.add(instance)
        db.flush()
    return instance


def get_or_create_demo_user(db: Session, roles: dict[str, Role], key: str, first_name: str, last_name: str, role_name: str) -> User:
    email = f"culturehub-demo-{key}@{EMAIL_DOMAIN}"
    try:
        EMAIL_VALIDATOR.validate_python(email)
    except Exception as exc:
        raise RuntimeError("CULTUREHUB_DEMO_EMAIL_DOMAIN must produce a valid email address") from exc

    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        legacy_email = f"culturehub-demo-{key}@example.invalid"
        user = db.scalar(select(User).where(User.email == legacy_email))
        if user is not None:
            user.email = email
            db.flush()
    if user is None:
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password_hash=get_password_hash(DEMO_PASSWORD),
            role_id=roles[role_name].id,
        )
        db.add(user)
        db.flush()
    return user


def seed() -> dict[str, int]:
    with engine.connect() as connection:
        database_name = connection.execute(text("select current_database()")).scalar_one()
        if database_name != "culturehub_test":
            raise RuntimeError("Refusing to populate a database other than culturehub_test")
        required_tables = {"roles", "users", "categories", "works", "events", "bookings", "feedback"}
        if not required_tables.issubset(set(inspect(connection).get_table_names(schema="public"))):
            raise RuntimeError("culturehub_test does not contain the required schema")

    db = SessionLocal()
    try:
        roles = {name: get_or_create(db, Role, {"name": name}, {"name": name}) for name in ("Admin", "Operatore", "Visitatore")}
        users = []
        demo_users = [
            ("admin", "Amministratore", "CultureHub", "Admin"),
            ("operatore", "Operatore", "CultureHub", "Operatore"),
            ("visitatore1", "Giulia", "Rossi", "Visitatore"),
            ("visitatore2", "Marco", "Bianchi", "Visitatore"),
            ("visitatore3", "Elena", "Conti", "Visitatore"),
            ("visitatore4", "Luca", "Ferrari", "Visitatore"),
        ]
        for key, first_name, last_name, role_name in demo_users:
            users.append(get_or_create_demo_user(db, roles, key, first_name, last_name, role_name))

        categories = [get_or_create(db, Category, {"name": name}, {"name": name, "description": description}) for name, description in CATEGORIES]
        works = []
        for title, author, description, category_index in WORKS:
            works.append(get_or_create(db, Work, {"title": title}, {
                "title": title,
                "author": author,
                "description": description,
                "image_url": None,
                "status": "active",
                "category_id": categories[category_index].id,
            }))

        now = datetime.now(timezone.utc)
        events = []
        for title, description, location, days, capacity, status in EVENTS:
            starts_at = now + timedelta(days=days)
            events.append(get_or_create(db, Event, {"title": title}, {
                "title": title,
                "description": description,
                "location": location,
                "starts_at": starts_at,
                "ends_at": starts_at + timedelta(hours=2),
                "capacity": capacity,
                "status": status,
            }))

        published_events = [event for event in events if event.status == "published"]
        bookings = []
        for index in range(40):
            user = users[2 + ((index // len(published_events)) % 4)]
            event = published_events[index % len(published_events)]
            existing = db.scalar(select(Booking).where(Booking.user_id == user.id, Booking.event_id == event.id))
            if existing is None:
                status = "cancelled" if index >= 32 else ("confirmed" if index % 3 else "pending")
                booking = Booking(user_id=user.id, event_id=event.id, seats=1 + (index % 2), status=status)
                db.add(booking)
                db.flush()
                bookings.append(booking)
            else:
                bookings.append(existing)

        feedback_count = db.query(Feedback).count()
        for index, booking in enumerate(bookings):
            if feedback_count >= 18:
                break
            if db.scalar(select(Feedback).where(Feedback.booking_id == booking.id)) is not None:
                continue
            db.add(Feedback(
                user_id=booking.user_id,
                booking_id=booking.id,
                rating=3 + (index % 3),
                comment=("Esperienza molto interessante e ben curata." if index % 2 == 0 else "Un percorso coinvolgente, con ottimi contenuti."),
                moderation_status="approved" if index < 10 else "pending",
            ))
            feedback_count += 1

        db.commit()
        return {
            "roles": db.query(Role).count(),
            "users": db.query(User).count(),
            "categories": db.query(Category).count(),
            "works": db.query(Work).count(),
            "events": db.query(Event).count(),
            "bookings": db.query(Booking).count(),
            "feedback": db.query(Feedback).count(),
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print(seed())
