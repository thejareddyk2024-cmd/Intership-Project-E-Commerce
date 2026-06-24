import redis
import json
import hashlib
from app.core.config import settings


class RedisCache:
    """
    Redis cache wrapper with graceful fallback.
    If Redis is unavailable, all operations silently return None / do nothing,
    so the app falls back to direct DB queries with zero breakage.
    """

    def __init__(self):
        self.client = None
        if settings.REDIS_URL:
            try:
                self.client = redis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=2,
                    socket_timeout=2,
                )
                # Quick ping to verify connection
                self.client.ping()
                print("✅ Redis connected successfully")
            except Exception as e:
                print(f"⚠️  Redis not available ({e}), running without cache")
                self.client = None
        else:
            print("ℹ️  REDIS_URL not set, running without cache")

    def get(self, key: str):
        """Get a cached value. Returns parsed JSON or None."""
        if not self.client:
            return None
        try:
            data = self.client.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception:
            return None

    def set(self, key: str, value, ttl: int = 300):
        """Cache a value as JSON with a TTL in seconds (default 5 min)."""
        if not self.client:
            return
        try:
            self.client.setex(key, ttl, json.dumps(value))
        except Exception:
            pass

    def delete(self, key: str):
        """Delete a specific cache key."""
        if not self.client:
            return
        try:
            self.client.delete(key)
        except Exception:
            pass

    def delete_pattern(self, pattern: str):
        """Delete all keys matching a pattern (e.g. 'products:*')."""
        if not self.client:
            return
        try:
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
        except Exception:
            pass

    @staticmethod
    def make_hash(text: str) -> str:
        """Create a short hash from text for use in cache keys."""
        return hashlib.md5(text.encode()).hexdigest()[:12]


# Singleton instance — imported by other modules
cache = RedisCache()
