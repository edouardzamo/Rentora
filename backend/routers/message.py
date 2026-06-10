# backend/routers/message.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from slowapi import Limiter, _rate_limit_exceeded_handler
from backend.create_tables import get_db
from backend.postgres.listings import Listing
from backend.postgres.models.user import User
from backend.schemas.current_user import get_current_user
from backend.postgres.message import Message
from backend.postgres.conversations import Conversations
from backend.schemas.message_schemas import MessageResponse

router = APIRouter(tags=["Messages"])

@router.post("/")
async def create_message_endpoint():
    return {"message": "Use /conversation/{listing_id} to start a conversation"}

@router.post("/conversation/{listing_id}", response_model=None)
async def create_message(
    listing_id: int,
    message: MessageResponse,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    db_message = Message(
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
    conversation = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if current_user.id != conversation.tenant_id and current_user.id != conversation.landlord_id:
        raise HTTPException(status_code=403, detail="You are not part of this conversation")

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
    conversation = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if current_user.id != conversation.tenant_id and current_user.id != conversation.landlord_id:
        raise HTTPException(status_code=403, detail="You are not part of this conversation")

    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    return messages

# FIXED: Get all conversations for the current user
@router.get("/conversations")
async def get_conversations(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Get all conversations for the current user"""
    
    # Find all conversations where user is either tenant or landlord
    conversations = db.query(
        Conversations.id,
        Conversations.listing_id,
        Listing.title.label("listing_title"),
        func.max(Message.created_at).label("last_message_time"),
        func.count(Message.id).label("message_count")
    ).join(
        Listing, Conversations.listing_id == Listing.id
    ).join(
        Message, Message.conversation_id == Conversations.id
    ).filter(
        (Conversations.tenant_id == current_user.id) | 
        (Conversations.landlord_id == current_user.id)
    ).group_by(
        Conversations.id, Conversations.listing_id, Listing.title
    ).order_by(
        desc("last_message_time")
    ).all()
    
    result = []
    for conv in conversations:
        # Get the last message content
        last_message = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(desc(Message.created_at)).first()
        
        # Determine other party name
        other_party_id = None
        other_party_name = "Other User"
        
        if conv.tenant_id == current_user.id:
            other_party_id = conv.landlord_id
            other_party_name = "Landlord"
        else:
            other_party_id = conv.tenant_id
            other_party_name = "Tenant"
        
        result.append({
            "id": conv.id,
            "listing_id": conv.listing_id,
            "listing_title": conv.listing_title,
            "last_message": last_message.content if last_message else "",
            "last_message_time": conv.last_message_time,
            "unread_count": 0,
            "other_party_id": other_party_id,
            "other_party_name": other_party_name
        })
    
    return result