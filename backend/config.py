# backend/config.py
import os

# Hardcoded configuration - no .env file needed
DATABASE_URL = "postgresql+psycopg2://postgres:SoNNa1123@localhost:5433/rentora"
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
REFRESH_TOKEN_EXPIRE_DAYS = 7
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Cloudinary Config - Hardcoded directly (no .env file)
CLOUDINARY_CLOUD_NAME = "dz0hu2rkj"
CLOUDINARY_API_KEY = "558695397797975"
CLOUDINARY_API_SECRET = "KWCJOy5Xn_hyIlHlKLoKEoCAKzc"

print(f"Cloudinary Config - Cloud Name: {CLOUDINARY_CLOUD_NAME}")
print(f"Cloudinary Config - API Key: {CLOUDINARY_API_KEY[:5]}...")
print(f"Cloudinary Config - API Secret: {'SET' if CLOUDINARY_API_SECRET else 'NOT SET'}")