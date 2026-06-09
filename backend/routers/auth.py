
from fastapi import APIRouter, Depends, HTTPException,Request
from jose import jwt
from  slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address 
from sqlalchemy.orm import Session  
from backend.postgres.models import user
from backend.postgres.models.refresh_token import RefreshToken
from backend.postgres.models.refresh_token import RefreshToken
from backend.schemas.jwt import SECRET_KEY,ALGORITHM
from backend.postgres.models.user import User
from backend.schemas.login import LoginSchema
from backend.schemas.register import RegisterSchema
from backend.schemas.utils import hash_password, verify_password
from backend.create_tables import get_db
from backend.schemas.jwt import create_access_token,create_refresh_token
from backend.schemas.current_user import get_current_user
from backend.schemas.logger import logger
from backend.schemas.auth_schema import TokenResponseSchema
from backend.schemas.user_schema import UserResponse
from backend.schemas.user_credentials_change import UpdateProfileSchema,ChangePasswordSchema
from backend.schemas.utils import hash_password, verify_password



router = APIRouter(
    tags=["Authentication"]
)

@router.post("/register")
# @Limiter.limit("10/hour")  # Limit to 10 registrations per hour per IP
async def register_user(user: RegisterSchema, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.number == user.phone_number).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="phone number already exists")

    if user.role not in ["tenant", "landlord"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'tenant' or 'landlord'.")

    new_user = User(
        username=user.username,
        number=user.phone_number,
        password_hash=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # ✅ FIX: Add role to the token
    token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
    refresh_token = create_refresh_token(data={"sub": str(new_user.id), "role": new_user.role})
    return TokenResponseSchema(message="User registered successfully", token=token, refresh_token=refresh_token)



@router.post("/login",response_model=TokenResponseSchema)
async def login_user(request: Request, credentials: LoginSchema, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.number == credentials.phone_number).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid phone number or password")

    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid phone number or password")
    
    print(f"receive credentials{credentials}")
    print(f"found user: {credentials.phone_number} with role:{credentials.parse_raw}")
    # token = create_access_token(data={"sub": user.id, "role": user.role})
    token = create_access_token(data={"sub": str(user.id), "role": user.role}) 
    refresh_token = create_refresh_token(data={"sub": user.id, "role": user.role})
    logger.info(f"User {user.id} logged out successfully")
    return {
        "message": "Login successful",
        "token": token,
        "refresh_token": refresh_token}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user["id"],
        "name" : current_user["name"],
        "phone_number": current_user["phone_number"],
        "role": current_user["role"],
          }


@router.post("/refresh")
async def refresh_token(refresh_token : str):
    payload = jwt.decode(
        refresh_token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh"
        )
    new_access_token = create_access_token(
        {
            "sub": payload["sub"]
        }
    )
    return {
        "access_token" : new_access_token
    }


@router.post("/logout")
async def logout(
    refresh_token : str,
    db : Session = Depends(get_db)
):
    token = db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    if token:
        db.delete(token)
        db.commit()

    return {"message": "Logged out successfully"}

@router.get("/health")
async def health_check():
    return { "status" : "healthy"}

@router.put("/me")
async def update_profile(
    payload: UpdateProfileSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.name = payload.name
    current_user.phone_number = payload.phone_number

    db.commit()
    db.refresh(current_user)

    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "phone_number": current_user.phone_number,
        "role": current_user.role
    }

@router.put("/change-password")
async def change_password(
    payload : ChangePasswordSchema,
    db : Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    if not verify_password(payload.old_password, current_user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    if len(payload.new_password) < 5:
        raise HTTPException(status_code=400, detail= "Password is five characters")
    current_user.password = hash_password(payload.new_password)
    db.commit()

    return {"message" : "password changed sucessfully"}
