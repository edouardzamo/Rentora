from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from backend.create_tables import get_db
from backend.postgres.listings import Listing
from backend.postgres.models.user import User
from backend.schemas.current_user import get_current_user
from backend.postgres.message import Message
from backend.postgres.conversations import Conversations
from backend.schemas.message_schemas import MessageResponse
from sqlalchemy import func

router = APIRouter(
    tags=["Messages"]
)

@router.post("/")
# @Limiter.limit("20/minute")  # Limit to 20 messages per minute per user

@router.post("/conversation/{listing_id}", response_model=None)
async def create_message(
    listing_id: int,
    message: MessageResponse,  #  Fixed: Use Pydantic schema
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if the listing exists and get/create conversation
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Find or create conversation for this listing and users
    conversation = db.query(Conversations).filter(
        Conversations.listing_id == listing_id,
        Conversations.tenant_id == current_user.id,
        Conversations.landlord_id == listing.owner_id
    ).first()
    
    if not conversation:
        # Create new conversation
        conversation = Conversations(
            listing_id=listing_id,
            tenant_id=current_user.id,
            landlord_id=listing.owner_id
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # Create the message
    db_message = Message(  # Fixed: Use Message model
        conversation_id=conversation.id,
        sender_id=current_user.id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.post("/{conversation_id}")
async def create_message_in_conversation(
    conversation_id: int,
    message: MessageResponse,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if the conversation exists
    conversation = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if the user is part of the conversation
    if current_user.id != conversation.tenant_id and current_user.id != conversation.landlord_id:
        raise HTTPException(status_code=403, detail="You are not part of this conversation")

    # Create the message
    db_message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/{conversation_id}")
async def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if the conversation exists
    conversation = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if the user is part of the conversation
    if current_user.id != conversation.tenant_id and current_user.id != conversation.landlord_id:
        raise HTTPException(status_code=403, detail="You are not part of this conversation")

    # Get messages for the conversation
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).all()
    return messages

# Add to backend/routers/message.py
@router.get("/conversations")
async def get_conversations(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all conversations for the current user"""
    # This will return unique conversations grouped by listing and other user
    # Returns: list of conversations with last message, unread count, etc.
    conversations = db.query(
        Message.listing_id,
        func.max(Message.created_at).label('last_message_time'),
        func.count(Message.id).label('message_count')
    ).filter(
        (Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id)
    ).group_by(Message.listing_id).order_by(func.max(Message.created_at).desc()).all()
    
    return conversations