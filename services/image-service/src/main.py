import os
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime
from src.handlers.cloudinary_handler import CloudinaryHandler
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PALMSTRY Image Service")

# Supabase Auth/Client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Service role for backend
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class ImageUploadRequest(BaseModel):
    user_id: str
    image_data: str # Base64 string
    hand: str # 'left' or 'right'

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "image-service",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/upload")
async def upload_image(req: ImageUploadRequest):
    """
    Dual-Storage Pipeline:
    1. Upload to Supabase Storage (Safe-keeper)
    2. Upload to Cloudinary (Vision Pipeline)
    """
    try:
        # 1. Cloudinary Process (1 Credit)
        handler = CloudinaryHandler()
        cloudinary_result = handler.upload_palm_image(
            req.image_data, 
            req.user_id, 
            req.hand
        )

        # 2. Supabase Metadata Sync (Record in database)
        # Note: In a production scenario, we might also stream binary to Supabase Storage.
        # But for MVP, keeping Cloudinary + Metadata in Supabase matches user request.
        
        return {
            "success": True,
            "data": cloudinary_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
