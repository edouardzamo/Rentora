from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.create_tables import get_db
from backend.postgres.models.user import User
from backend.schemas.current_user import get_current_user



def require_landlord_role(current_user: User = Depends(get_current_user)):
    if current_user["role"] != "landlord":
        raise HTTPException(status_code=403, detail="Access forbidden: Landlord role required")
    return current_user

def require_tenant_role(current_user: User = Depends(get_current_user)):
    if current_user["role"] != "tenant":
        raise HTTPException(status_code=403, detail="Access forbidden: Tenant role required")
    return current_user

