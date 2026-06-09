from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from backend.create_tables import get_db
from backend.postgres.models.user import User
from backend.schemas.current_user import get_current_user


router = APIRouter(
    tags=["Users"]
)

