# backend/schemas/jwt.py
from backend.config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM, REFRESH_TOKEN_EXPIRE_DAYS
from jose import jwt  
from datetime import datetime, timedelta 
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRETE_KEY = SECRET_KEY
ALGORITHM = ALGORITHM

def create_access_token(data: dict):
    """Create access token (short-lived)"""
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    
    # Ensure sub is string
    if "sub" in payload:
        payload["sub"] = str(payload["sub"])
    
    token = jwt.encode(payload, SECRETE_KEY, algorithm=ALGORITHM)
    logger.info(f"Access token created for user: {payload.get('sub')}")
    return token

def create_refresh_token(data: dict):
    """Create refresh token (long-lived)"""
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload.update({"exp": expire, "type": "refresh"})
    
    # Ensure sub is string
    if "sub" in payload:
        payload["sub"] = str(payload["sub"])
    
    token = jwt.encode(payload, SECRETE_KEY, algorithm=ALGORITHM)
    logger.info(f"Refresh token created for user: {payload.get('sub')}")
    return token

def verify_access_token(token: str):
    """Verify access token"""
    try:
        logger.info(f"Decoding token...")
        payload = jwt.decode(token, SECRETE_KEY, algorithms=[ALGORITHM])
        logger.info(f"Decoded payload: {payload}")
        
        # Check if it's a refresh token (optional)
        if payload.get("type") == "refresh":
            logger.error("This is a refresh token, not an access token")
            return None
        
        user_id = payload.get("sub")
        role = payload.get("role")
        
        if user_id is None:
            logger.error("No sub field in token")
            return None
        
        return {"user_id": user_id, "role": role}
        
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        return None
    except jwt.JWTError as e:
        logger.error(f"JWT Error: {e}")
        return None

def verify_refresh_token(token: str):
    """Verify refresh token"""
    try:
        payload = jwt.decode(token, SECRETE_KEY, algorithms=[ALGORITHM])
        
        # Check if it's a refresh token
        if payload.get("type") != "refresh":
            logger.error("This is not a refresh token")
            return None
        
        user_id = payload.get("sub")
        if user_id is None:
            logger.error("No sub field in token")
            return None
        
        return {"user_id": user_id}
        
    except jwt.ExpiredSignatureError:
        logger.error("Refresh token has expired")
        return None
    except jwt.JWTError as e:
        logger.error(f"JWT Error: {e}")
        return None