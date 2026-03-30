import os
import cloudinary
import cloudinary.uploader
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

class CloudinaryHandler:
    
    @staticmethod
    def upload_palm_image(
        image_data: str, # Base64 or URL
        user_id: str,
        hand: str  # 'left' or 'right'
    ) -> dict:
        """
        Upload palm image with transformations applied.
        Uses 1 Cloudinary credit per upload (Eager).
        """
        try:
            result = cloudinary.uploader.upload(
                image_data,
                folder=f"palmistry/{user_id}",
                public_id=f"{hand}_{datetime.utcnow().timestamp()}",
                
                # Apply transformations on upload (eager) to save credits
                transformation=[
                    {"width": 1024, "height": 1024, "crop": "limit"},
                    {"effect": "improve"},
                    {"quality": "auto:good"},
                ],
                
                # Auto-delete after 30 days logic (tagging)
                invalidate=True,
                tags=[f"user_{user_id}", "palm", hand, f"exp_{datetime.utcnow().strftime('%Y%m%d')}"],
                
                resource_type="image"
            )
            
            return {
                "url": result["secure_url"],
                "public_id": result["public_id"],
                "width": result["width"],
                "height": result["height"],
                "bytes": result["bytes"]
            }
        except Exception as e:
            print(f"[CLOUDINARY ERROR] {str(e)}")
            raise e

    @staticmethod
    def delete_old_images() -> dict:
        """
        Deletes images older than 30 days based on expiration tag.
        """
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        tag = f"exp_{thirty_days_ago.strftime('%Y%m%d')}"
        
        result = cloudinary.api.delete_resources_by_tag(tag)
        return result
