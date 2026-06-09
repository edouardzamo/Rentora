from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.create_tables import get_db
from backend.schemas.current_user import get_current_user
from backend.postgres.models.user import User
from backend.postgres.models.notification import Notification
from backend.postgres.listings import Listing
from backend.postgres.models.favorite import Favorite



router = APIRouter(    
    tags=["Dashboard"]
)

@router.get("/notifications")
async def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    return notifications


@router.put("/notifications/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}