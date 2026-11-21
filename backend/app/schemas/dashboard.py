from pydantic import BaseModel


class DashboardSummary(BaseModel):
    users: int
    categories: int
    works: int
    events: int
    bookings: int
    feedback: int

