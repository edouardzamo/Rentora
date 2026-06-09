# backend/config.py
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env file only for local development
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Read DATABASE_URL from environment variable (Render) or .env (local)
DATABASE_URL = os.getenv("DATABASE_URL")

# If not set, use local default (for development)
if not DATABASE_URL:
    DATABASE_URL = "postgresql+psycopg2://postgres:SoNNa1123@localhost:5433/rentora"
    print("Using local database")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

print(f"Cloudinary Config - Cloud Name: {CLOUDINARY_CLOUD_NAME}")