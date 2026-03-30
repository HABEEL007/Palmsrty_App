import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import google.generativeai as genai
import hashlib
from src.cache.redis_cache import AnalysisCache
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PALMSTRY AI Service")

# 1. Memory Cache (L1 - Fastest, $0)
memory_cache = {}

# 2. Supabase Client (L3 - Persistent, $0)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 3. Gemini Configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Models
MODEL_FULL = "gemini-1.5-flash"
MODEL_MINI = "gemini-1.5-flash" # Gemini Flash is already cheap, but we route to it.

class AnalyzeRequest(BaseModel):
    user_id: str
    image_url: str
    image_bytes: str # Base64 for hashing

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-service",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/analyze")
async def analyze_palm(req: AnalyzeRequest):
    """
    Multi-Level Caching Logic (Strategic Cost Management):
    1. L1: Memory Cache (In-process)
    2. L2: Upstash Redis Cache (Shared)
    3. L3: Supabase Cache (Persistent History)
    4. L4: Gemini API (Last resort)
    """
    image_hash = hashlib.sha256(req.image_bytes.encode()).hexdigest()
    cache_key = AnalysisCache.generate_key(req.user_id, image_hash)
    
    # --- LEVEL 1: MEMORY CACHE ---
    if image_hash in memory_cache:
        return {"success": True, "data": memory_cache[image_hash], "source": "memory"}

    # --- LEVEL 2: REDIS CACHE ---
    cached_redis = await AnalysisCache.get(cache_key)
    if cached_redis:
        memory_cache[image_hash] = cached_redis
        return {"success": True, "data": cached_redis, "source": "redis"}

    # --- LEVEL 3: SUPABASE CACHE ---
    try:
        db_res = supabase.table("analysis_cache").select("*").eq("image_hash", image_hash).execute()
        if db_res.data:
            analysis = db_res.data[0]["analysis_result"]
            # Populate upper caches
            await AnalysisCache.set(cache_key, analysis)
            memory_cache[image_hash] = analysis
            return {"success": True, "data": analysis, "source": "database"}
    except Exception as e:
        print(f"[DB CACHE ERROR] {str(e)}")

    # --- LEVEL 4: CALL AI (GEMINI) ---
    try:
        # Cost saving: Check simple quality score or user tier here
        # (Assuming 1.5-flash for all free tier currently)
        model = genai.GenerativeModel(MODEL_FULL)
        prompt = "Analyze this palm for palmistry lines and mounts. Return structured JSON."
        
        response = model.generate_content(prompt)
        # Mocking structured JSON for stability in this build
        result = {
            "handShape": "Earth",
            "majorLines": {"life": "Deep", "heart": "Straight"},
            "personality": ["Steady", "Reliable"]
        }

        # UPDATE ALL CACHES
        memory_cache[image_hash] = result
        await AnalysisCache.set(cache_key, result)
        supabase.table("analysis_cache").upsert({
            "image_hash": image_hash,
            "analysis_result": result
        }).execute()

        return {"success": True, "data": result, "source": "ai"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
