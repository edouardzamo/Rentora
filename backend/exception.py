from fastapi import Request,HTTPException
from fastapi.responses import JSONResponse
from backend.schemas.logger import logger


async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success" : False,"message": exc.detail}
    )

async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception( str(exc) )
    return JSONResponse(
        status_code=500,
        content={"success" : False,"message": "An unexpected error occurred"}
    )