from fastapi import APIRouter,Depends,HTTPException
from backend.schemas.view_schema import ReviewCreate, ReviewResponse
from backend.create_tables import get_db
from backend.postgres.models.user import User 
from backend.postgres.models.review import Review
from sqlalchemy.orm import Session

from backend.schemas.roles import require_tenant_role,require_landlord_role

router = APIRouter(
    tags=["Reviews"]
)


@router.post("/{listing_id}")
async def create_review(
    listing_id : int,
    payload : ReviewCreate,
    db : Session = Depends(get_db),
    current_user : User = Depends(require_tenant_role)
):
    if payload.rating < 1 or payload.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    review = Review(
        listing_id = listing_id,
        user_id = current_user.id,
        rating=payload.rating,
        comment=payload.comment
    )

    db.add(review)
    db.commit()
    db.refresh()

    return review

@router.get("/{listing_id}")
async def get_views(listing_id : int, db : Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.listing_id == listing_id).all()
    return reviews