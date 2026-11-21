from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import auth, bookings, categories, catalog, dashboard, events, feedback as feedback_router, users
from app.core.config import settings
from app.middleware.errors import app_error_middleware
from app.db.database import Base, engine
from app.models import booking, category, event, feedback, role, user, work


app = FastAPI(title=settings.app_name, debug=settings.app_debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(app_error_middleware)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(catalog.router, prefix="/api/v1")
app.include_router(events.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(feedback_router.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
