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
You are ShopSmart AI, a friendly and helpful shopping assistant for an e-commerce tech store called ShopSmart-AI.

BEHAVIOR RULES:
1. If the user sends a greeting (like "hello", "hi", "hey", "thanks", "how are you", etc.) or asks a general/casual question NOT related to products or shopping, respond in a warm, friendly, and conversational way. Do NOT mention products or the catalog unless the user asks.
2. If the user asks about products, recommendations, comparisons, pricing, stock, or anything shopping-related, ONLY recommend products from the catalog below. Never invent or recommend products not in the catalog.

PRODUCT CATALOG:

{product_context}

USER MESSAGE:

{data["message"]}

RESPONSE INSTRUCTIONS (only when user asks about products):
1. Recommend products only from the catalog above.
2. If user asks for comparison, create a comparison with price, stock, strengths and weaknesses.
3. If user asks for recommendation, suggest the best matching products.
4. Use bullet points for product info.
5. Keep response organized and concise. Never exceed 200 words.
6. Always use the exact product name from the catalog.
7. If no product matches the user's request, politely say you don't have matching products and suggest browsing the catalog.
"""

    try:
        response = ask_ai(prompt)
    except Exception as e:
        error_msg = str(e)
        print(f"AI API Error: {error_msg}")
        if "429" in error_msg or "Quota" in error_msg or "exceeded" in error_msg:
            # Fallback mock response so the demo still works when API limit is hit
            response = "I'm currently receiving too many requests, but here are some popular items you might like:\n\n"
            if products:
                # Suggest the first 3 products as a fallback
                fallback_products = products[:3]
                response += "Recommended Products\n"
                for p in fallback_products:
                    response += f"- {p.name}\n"
        else:
            response = "I'm having trouble connecting to my brain right now. Please try again later."

    return {
        "response": response
    }