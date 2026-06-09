from backend.postgres.connection import Base, engine
from backend.postgres.models.user import User
from backend.postgres.models.notification import Notification
from backend.postgres.listings import Listing
from backend.postgres.image import PropertyImage
from backend.postgres import conversations
from backend.postgres import connection 
from backend.postgres.message import Message
from backend.postgres.conversations import Conversations
from backend.postgres.models.favorite import Favorite
from backend.postgres.connection import SessionLocal
from backend.postgres.models.review import Review

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)