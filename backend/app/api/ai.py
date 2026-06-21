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

You are ShopSmart-AI.

When recommending products:

Return answers in this format:

Recommended Products

1. Product Name
   Price:
   Stock:
   Why it matches:

2. Product Name
   Price:
   Stock:
   Why it matches:

Keep answers concise.

Never exceed 200 words.

Only use products from the catalog.

If no product matches,
say:
"No suitable products found in our catalog."


3. If no suitable product exists, say so.


4. Mention prices when relevant.

5.Rules:

When recommending products,
always return product names exactly as stored.

Format:

PRODUCTS:
Product Name 1
Product Name 2
Product Name 3

REASON:
Short explanation.
"""

    response = ask_ai(prompt)

    return {
        "response": response
    }