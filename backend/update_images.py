import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.database.database import SessionLocal, engine
from app.database.base import Base
from app.models.product import Product
from app.models.category import Category

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Category generic images
CATEGORY_IMAGES = {
    "Mobile Phones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    "Laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
    "Tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
    "Earbuds": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
}

# Reliable specific product images mapped by product name keywords
IMAGE_MAP = {
    # Phones
    "Samsung Galaxy S24": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop",
    "iPhone 15": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    "iPhone 16": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop", # using generic phone
    "Pixel": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=400&fit=crop",
    "OnePlus": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=400&fit=crop",
    
    # Laptops
    "MacBook": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
    "XPS": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop",
    "ThinkPad": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
    
    # Tablets
    "iPad": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
    "Galaxy Tab": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
    
    # Earbuds
    "AirPods": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=400&fit=crop",
    "WF-1000XM5": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
    "Galaxy Buds": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=400&fit=crop",
}

try:
    products = db.query(Product).all()
    categories = {c.id: c.name for c in db.query(Category).all()}
    
    updated = 0
    for product in products:
        # 1. Try to find a specific match in IMAGE_MAP
        matched = False
        for key, url in IMAGE_MAP.items():
            if key.lower() in product.name.lower():
                product.image_url = url
                matched = True
                break
        
        # 2. Fallback to a category-specific image
        if not matched:
            cat_name = categories.get(product.category_id, "")
            fallback_url = CATEGORY_IMAGES.get(cat_name)
            
            # 3. Ultimate fallback (clean minimalist tech background)
            if not fallback_url:
                fallback_url = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop"
                
            product.image_url = fallback_url
            
        updated += 1

    db.commit()
    print(f"Updated {updated} product images using smart category mapping.")
except Exception as e:
    db.rollback()
    print(f"Error: {e}")
    raise
finally:
    db.close()
