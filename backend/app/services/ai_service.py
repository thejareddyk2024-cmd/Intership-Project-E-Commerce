import google.generativeai as genai

from app.core.config import settings
from app.database.database import SessionLocal
from app.models.product import Product

genai.configure(
    api_key=settings.GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def ask_ai(prompt: str):

    db = SessionLocal()

    products = db.query(Product).all()

    product_context = ""

    for product in products:

        product_context += f"""
Name: {product.name}
Price: ${product.price}
Description: {product.description}
Stock: {product.stock_quantity}

"""

    final_prompt = f"""
You are ShopSmart AI.

ONLY recommend products from the catalog below.

Never recommend products that are not present.

CATALOG:

{product_context}

USER QUESTION:

{prompt}

Instructions:

1. Recommend products only from catalog.
2. If user asks for comparison:
   - Create a comparison table.
   - Compare price.
   - Compare stock.
   - Compare descriptions.
   - Give strengths and weaknesses.
3. If user asks for recommendation:
   - Suggest best products.
4. Use bullet points.
5. Keep response organized.
"""

    response = model.generate_content(
        final_prompt
    )

    db.close()

    return response.text