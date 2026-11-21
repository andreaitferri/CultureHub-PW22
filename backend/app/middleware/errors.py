from fastapi import Request
from fastapi.responses import JSONResponse


async def app_error_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception:
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})
