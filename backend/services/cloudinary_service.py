# backend/services/cloudinary_service.py
import cloudinary
import cloudinary.uploader
from backend.config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

# Configure Cloudinary
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)

def upload_image_to_cloudinary(file, folder="listings"):
    """Upload an image to Cloudinary"""
    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder=folder,
            transformation=[
                {"width": 800, "height": 600, "crop": "limit"},
                {"quality": "auto"}
            ]
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "format": result["format"],
            "width": result["width"],
            "height": result["height"]
        }
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        raise e

def delete_image_from_cloudinary(public_id):
    """Delete an image from Cloudinary"""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result
    except Exception as e:
        print(f"Cloudinary delete error: {e}")
        raise e