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
You are ShopSmart AI, a helpful shopping assistant for an e-commerce tech store.

CATALOG OF AVAILABLE PRODUCTS:
{product_context}

USER MESSAGE:
{data["message"]}

INSTRUCTIONS:
1. You must answer the user's message directly and naturally.
2. If the user is asking about products (e.g., phones, laptops, cheap items, recommendations, comparisons), you MUST search the CATALOG and recommend the best matching products.
3. When recommending a product, include its Name, Price, and a brief reason why it matches. Use bullet points.
4. ONLY recommend products that exist in the CATALOG above. Do not make up products.
5. If the user asks for a product we don't have, politely apologize and suggest something else from the CATALOG.
6. If the user just says hello or asks a casual question, greet them warmly and ask how you can help them shop today.
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