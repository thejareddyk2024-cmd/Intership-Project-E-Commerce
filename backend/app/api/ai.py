from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database.dependencies import get_db
from app.models.product import Product

from app.services.ai_service import (
    ask_ai
)

router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI"]
)


@router.post("/chat")
def chat_with_ai(
    data: dict,
    db: Session = Depends(get_db)
):

    products = db.query(Product).all()

    product_context = ""

    for product in products:
        product_context += f"""
Name: {product.name}
Description: {product.description}
Price: {product.price}
Stock: {product.stock_quantity}

"""

    prompt = f"""
You are ShopSmart-AI.

You are ONLY allowed to recommend products
that exist in the catalog below.

CATALOG:

{product_context}

User Question:

{data["message"]}

Rules:
1. Only use products from the catalog.
2. Do not invent products.
3. If no suitable product exists, say so.
4. Mention prices when relevant.
"""

    response = ask_ai(prompt)

    return {
        "response": response
    }