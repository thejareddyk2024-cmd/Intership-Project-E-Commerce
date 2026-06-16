from fastapi import FastAPI
from app.api.category import router as category_router
from app.api.auth import router as auth_router
from app.api.product import router as product_router
from app.api.wishlist import router as wishlist_router
from app.api.cart import router as cart_router
from app.api.order import router as order_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ShopSmart AI",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
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