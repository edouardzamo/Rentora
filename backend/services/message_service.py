from sqlalchemy.orm import Session
from backend.create_tables import get_db
from backend.postgres.listings import Listing
from backend.postgres.message import Message



def send_message(db: Session, conversation_id: int, sender_id: int, content: str):
    new_message = Message(
        conversation_id=conversation_id,
        sender_id=sender_id,
        content=content
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message