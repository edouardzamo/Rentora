# backend/schemas/current_user.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from backend.create_tables import get_db
from backend.postgres.models.user import User
from backend.schemas.jwt import verify_access_token
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        logger.info(f"Validating token...")
        
        token_data = verify_access_token(token)
        logger.info(f"Token data: {token_data}")
        
        if token_data is None:
            logger.error("Token validation failed")
            raise credentials_exception
        
        user_id_str = token_data.get("user_id")
        if user_id_str is None:
            logger.error("No user_id in token")
            raise credentials_exception
        
        # Convert string to int for database query
        user_id = int(user_id_str)
        
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            logger.error(f"User {user_id} not found")
            raise credentials_exception
        
        logger.info(f"User authenticated: {user.id} - {user.role}")
        return user
        
    except Exception as e:
        logger.error(f"Auth error: {e}")
        raise credentials_exception