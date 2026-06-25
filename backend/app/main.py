from fastapi import FastAPI
from app.api.category import router as category_router
from app.api.auth import router as auth_router
from app.api.product import router as product_router
from app.api.wishlist import router as wishlist_router
from app.api.cart import router as cart_router
from app.api.order import router as order_router
from app.api.admin import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.ai import router as ai_router
from app.api.review import (router as review_router)
from app.database.database import engine
from app.database.base import Base
from app.api.analytics import (
    router as analytics_router
)

Base.metadata.create_all(bind=engine)

# Auto-migrate: add any missing columns to existing tables
# SQLAlchemy's create_all() only creates NEW tables, not new columns on existing ones.
from sqlalchemy import inspect, text as sa_text
with engine.connect() as conn:
    inspector = inspect(engine)
    existing_columns = [c["name"] for c in inspector.get_columns("users")]
    if "shipping_address" not in existing_columns:
        conn.execute(sa_text("ALTER TABLE users ADD COLUMN shipping_address VARCHAR(500)"))
        conn.commit()
        print("✅ Migration: Added 'shipping_address' column to users table")

from app.core.config import settings

app = FastAPI(
    title="ShopSmart AI",
    version="1.0.0"
)

# Parse FRONTEND_URL and make origins robust against trailing slashes
allowed_origins = []
if settings.FRONTEND_URL:
    for origin in settings.FRONTEND_URL.split(","):
        o = origin.strip()
        if o:
            allowed_origins.append(o)
            # Handle both with and without trailing slash
            if o.endswith("/"):
                allowed_origins.append(o.rstrip("/"))
            else:
                allowed_origins.append(o + "/")

# Always include common local development origins and the live Vercel URL
for lo in [
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
    "http://localhost:3000",
    "https://shopsmart-ai-rho.vercel.app"
]:
    if lo not in allowed_origins:
        allowed_origins.append(lo)
        allowed_origins.append(lo + "/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to ShopSmart-AI API"
    }


app.include_router(auth_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(wishlist_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(admin_router)
app.include_router(ai_router)
app.include_router(
    review_router
)
app.include_router(
    analytics_router
)