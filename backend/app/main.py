from fastapi import FastAPI
from app.api.category import router as category_router
from app.api.auth import router as auth_router
from app.api.product import router as product_router
from app.api.wishlist import router as wishlist_router
from app.api.cart import router as cart_router
from app.api.order import router as order_router

app = FastAPI(
    title="ShopSmart AI",
    version="1.0.0"
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