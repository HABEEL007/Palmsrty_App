import os
import json
import hashlib
from typing import Optional
from upstash_redis import Redis
from dotenv import load_dotenv

load_dotenv()

# Configure Upstash Redis
redis = Redis(
    url=os.getenv("UPSTASH_REDIS_URL"),
    token=os.getenv("UPSTASH_REDIS_TOKEN")
)

class AnalysisCache:
    # 30 days TTL
    TTL_SECONDS = 30 * 24 * 60 * 60 

    @staticmethod
    def generate_key(user_id: str, image_hash: str) -> str:
        """Generate deterministic cache key."""
        return f"analysis:{user_id}:{image_hash}"

    @staticmethod
    async def get(key: str) -> Optional[dict]:
        """Check both Local Cache (Optional) and Upstash Redis."""
        try:
            cached = redis.get(key)
            if cached:
                return json.loads(cached)
            return None
        except Exception as e:
            print(f"[REDIS GET ERROR] {str(e)}")
            return None

    @staticmethod
    async def set(key: str, result: dict) -> None:
        """Cache result in Upstash Redis."""
        try:
            redis.setex(key, AnalysisCache.TTL_SECONDS, json.dumps(result))
        except Exception as e:
            print(f"[REDIS SET ERROR] {str(e)}")
