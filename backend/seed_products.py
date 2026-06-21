"""
Seed script: adds 10 mobile phones, 15 laptops, 5 tablets, 10 earbuds.
Run from the backend/ directory:
    python seed_products.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database.database import SessionLocal, engine
from app.database.base import Base
from app.models.category import Category
from app.models.product import Product

# Ensure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── Helper ────────────────────────────────────────────────────────────────────

def get_or_create_category(name: str, description: str) -> Category:
    cat = db.query(Category).filter(Category.name == name).first()
    if not cat:
        cat = Category(name=name, description=description)
        db.add(cat)
        db.flush()          # get the id without committing
    return cat


# ── Categories ────────────────────────────────────────────────────────────────

phones_cat  = get_or_create_category("Mobile Phones",  "Smartphones and mobile devices")
laptops_cat = get_or_create_category("Laptops",        "Portable computers and notebooks")
tablets_cat = get_or_create_category("Tablets",        "Tablet computers and iPads")
earbuds_cat = get_or_create_category("Earbuds",        "Wireless earbuds and earphones")

# ── Mobile Phones (10) ────────────────────────────────────────────────────────

phones = [
    {
        "name": "Samsung Galaxy S24 Ultra",
        "description": "6.8\" QHD+ Dynamic AMOLED, Snapdragon 8 Gen 3, 200MP camera, 5000mAh battery.",
        "price": 1299.99,
        "stock_quantity": 50,
        "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    },
    {
        "name": "Apple iPhone 15 Pro Max",
        "description": "6.7\" Super Retina XDR, A17 Pro chip, titanium design, 48MP triple camera.",
        "price": 1199.99,
        "stock_quantity": 45,
        "image_url": "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400",
    },
    {
        "name": "Google Pixel 8 Pro",
        "description": "6.7\" LTPO OLED, Google Tensor G3, 50MP triple camera, 7 years of OS updates.",
        "price": 999.99,
        "stock_quantity": 35,
        "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    },
    {
        "name": "OnePlus 12",
        "description": "6.82\" LTPO 3.0 AMOLED, Snapdragon 8 Gen 3, 50MP Hasselblad triple camera, 100W fast charge.",
        "price": 799.99,
        "stock_quantity": 40,
        "image_url": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400",
    },
    {
        "name": "Samsung Galaxy A55",
        "description": "6.6\" Super AMOLED, Exynos 1480, 50MP OIS camera, IP67 water resistance.",
        "price": 449.99,
        "stock_quantity": 60,
        "image_url": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    },
    {
        "name": "Xiaomi 14 Ultra",
        "description": "6.73\" LTPO AMOLED, Snapdragon 8 Gen 3, Leica 1-inch sensor quad camera.",
        "price": 1099.99,
        "stock_quantity": 25,
        "image_url": "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400",
    },
    {
        "name": "Apple iPhone 15",
        "description": "6.1\" Super Retina XDR, A16 Bionic, 48MP dual camera, Dynamic Island.",
        "price": 799.99,
        "stock_quantity": 55,
        "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484428d9?w=400",
    },
    {
        "name": "Motorola Edge 50 Pro",
        "description": "6.7\" pOLED 144Hz, Snapdragon 7 Gen 3, 50MP triple camera, 125W turbo charge.",
        "price": 549.99,
        "stock_quantity": 38,
        "image_url": "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400",
    },
    {
        "name": "Nothing Phone (2)",
        "description": "6.7\" LTPO OLED, Snapdragon 8+ Gen 1, unique Glyph Interface LED system.",
        "price": 699.99,
        "stock_quantity": 30,
        "image_url": "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=400",
    },
    {
        "name": "Realme GT 6",
        "description": "6.78\" AMOLED 120Hz, Snapdragon 8s Gen 3, 50MP triple camera, 120W flash charge.",
        "price": 499.99,
        "stock_quantity": 42,
        "image_url": "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400",
    },
]

# ── Laptops (15) ─────────────────────────────────────────────────────────────

laptops = [
    {
        "name": "Apple MacBook Pro 16\" M3 Max",
        "description": "M3 Max chip, 36GB RAM, 1TB SSD, Liquid Retina XDR display, 22h battery.",
        "price": 3499.99,
        "stock_quantity": 20,
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    },
    {
        "name": "Dell XPS 15 (2024)",
        "description": "Intel Core Ultra 9, RTX 4070, 32GB DDR5, 1TB NVMe, 15.6\" OLED touch display.",
        "price": 2499.99,
        "stock_quantity": 25,
        "image_url": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
    },
    {
        "name": "Lenovo ThinkPad X1 Carbon Gen 12",
        "description": "Intel Core Ultra 7, 32GB LPDDR5, 1TB SSD, 14\" IPS anti-glare, MIL-SPEC durability.",
        "price": 1899.99,
        "stock_quantity": 30,
        "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    },
    {
        "name": "ASUS ROG Zephyrus G14 (2024)",
        "description": "AMD Ryzen 9 8945HS, RX 7900S, 32GB DDR5, 1TB SSD, 14\" OLED 165Hz.",
        "price": 2199.99,
        "stock_quantity": 18,
        "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    },
    {
        "name": "HP Spectre x360 14",
        "description": "Intel Core Ultra 7, Intel Arc, 16GB RAM, 512GB SSD, 14\" 2.8K OLED touch 2-in-1.",
        "price": 1699.99,
        "stock_quantity": 22,
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    },
    {
        "name": "Microsoft Surface Laptop 6",
        "description": "Intel Core Ultra 5, 16GB RAM, 512GB SSD, 13.5\" PixelSense touchscreen.",
        "price": 1299.99,
        "stock_quantity": 28,
        "image_url": "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
    },
    {
        "name": "Razer Blade 16 (2024)",
        "description": "Intel Core i9-14900HX, RTX 4090, 32GB DDR5, 2TB SSD, 16\" QHD+ 240Hz OLED.",
        "price": 3999.99,
        "stock_quantity": 12,
        "image_url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
    },
    {
        "name": "Apple MacBook Air 15\" M3",
        "description": "M3 chip, 16GB RAM, 512GB SSD, 15.3\" Liquid Retina, fanless design, 18h battery.",
        "price": 1499.99,
        "stock_quantity": 40,
        "image_url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    },
    {
        "name": "Lenovo IdeaPad Slim 5i",
        "description": "Intel Core i7-13700H, 16GB DDR5, 512GB SSD, 16\" IPS 120Hz display.",
        "price": 849.99,
        "stock_quantity": 50,
        "image_url": "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400",
    },
    {
        "name": "Acer Swift Go 14",
        "description": "Intel Core Ultra 5, Intel Arc GPU, 16GB LPDDR5, 512GB SSD, 14\" 2.8K OLED.",
        "price": 999.99,
        "stock_quantity": 35,
        "image_url": "https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=400",
    },
    {
        "name": "Samsung Galaxy Book4 Pro 360",
        "description": "Intel Core Ultra 7, 32GB RAM, 1TB SSD, 16\" 3K AMOLED touch 2-in-1 with S Pen.",
        "price": 1999.99,
        "stock_quantity": 20,
        "image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    },
    {
        "name": "MSI Titan GT77 HX",
        "description": "Intel Core i9-13980HX, RTX 4090, 64GB DDR5, 2TB SSD, 17.3\" UHD 144Hz IPS.",
        "price": 4499.99,
        "stock_quantity": 8,
        "image_url": "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400",
    },
    {
        "name": "HP Pavilion 15",
        "description": "AMD Ryzen 5 7530U, 8GB RAM, 256GB SSD, 15.6\" FHD IPS — great value laptop.",
        "price": 499.99,
        "stock_quantity": 65,
        "image_url": "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400",
    },
    {
        "name": "Asus Zenbook 14 OLED",
        "description": "Intel Core Ultra 7 155H, Intel Arc, 16GB LPDDR5x, 1TB SSD, 14\" 2.8K OLED 120Hz.",
        "price": 1199.99,
        "stock_quantity": 32,
        "image_url": "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?w=400",
    },
    {
        "name": "LG Gram 16 (2024)",
        "description": "Intel Core Ultra 7, 32GB LPDDR5, 1TB SSD, 16\" IPS anti-glare — only 1.19 kg.",
        "price": 1549.99,
        "stock_quantity": 27,
        "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
    },
]

# ── Tablets (5) ───────────────────────────────────────────────────────────────

tablets = [
    {
        "name": "Apple iPad Pro 13\" M4",
        "description": "M4 chip, Ultra Retina XDR OLED, Apple Pencil Pro support, Nano-texture glass option.",
        "price": 1299.99,
        "stock_quantity": 25,
        "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    },
    {
        "name": "Samsung Galaxy Tab S9 Ultra",
        "description": "14.6\" Dynamic AMOLED 2X, Snapdragon 8 Gen 2, 12GB RAM, S Pen included, IP68.",
        "price": 1099.99,
        "stock_quantity": 20,
        "image_url": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    },
    {
        "name": "Apple iPad Air 11\" M2",
        "description": "M2 chip, 11\" Liquid Retina, Apple Pencil Pro & Magic Keyboard support, 5G option.",
        "price": 749.99,
        "stock_quantity": 35,
        "image_url": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=400",
    },
    {
        "name": "Microsoft Surface Pro 10",
        "description": "Intel Core Ultra 7, 16GB RAM, 256GB SSD, 13\" PixelSense Flow display, Windows 11.",
        "price": 1399.99,
        "stock_quantity": 18,
        "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    },
    {
        "name": "Lenovo Tab P12 Pro",
        "description": "Snapdragon 870, 8GB RAM, 256GB, 12.6\" AMOLED 2K, quad speakers — premium Android tablet.",
        "price": 649.99,
        "stock_quantity": 28,
        "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
    },
]

# ── Earbuds (10) ─────────────────────────────────────────────────────────────

earbuds = [
    {
        "name": "Apple AirPods Pro (2nd Gen)",
        "description": "Active Noise Cancellation, Adaptive Transparency, Spatial Audio, MagSafe charging case.",
        "price": 249.99,
        "stock_quantity": 70,
        "image_url": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
    },
    {
        "name": "Sony WF-1000XM5",
        "description": "Industry-leading ANC, LDAC Hi-Res, 8h battery + 16h case, IPX4, multipoint connection.",
        "price": 279.99,
        "stock_quantity": 55,
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    },
    {
        "name": "Samsung Galaxy Buds3 Pro",
        "description": "360° Audio, ANC, Blade Lights, 6h + 14h battery, IP57 water resistance.",
        "price": 229.99,
        "stock_quantity": 60,
        "image_url": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400",
    },
    {
        "name": "Bose QuietComfort Ultra Earbuds",
        "description": "Immersive Audio, best-in-class ANC, 6h + 18h case, CustomTune personalization.",
        "price": 299.99,
        "stock_quantity": 40,
        "image_url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    },
    {
        "name": "Nothing Ear (2)",
        "description": "Dual microphone ANC, LHDC 5.0, 6.3h + 36h battery, transparent design.",
        "price": 149.99,
        "stock_quantity": 65,
        "image_url": "https://images.unsplash.com/photo-1610438235354-a6ae5528a32b?w=400",
    },
    {
        "name": "Jabra Elite 10",
        "description": "Dolby Atmos Spatial Sound, MultiSensor Voice, 6h + 27h case, IP57, Bluetooth 5.3.",
        "price": 249.99,
        "stock_quantity": 45,
        "image_url": "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400",
    },
    {
        "name": "OnePlus Buds Pro 2",
        "description": "Dynaudio-tuned, 48dB ANC, LHDC 5.0 Hi-Res, 9h + 25h battery, IP55.",
        "price": 179.99,
        "stock_quantity": 50,
        "image_url": "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=400",
    },
    {
        "name": "Google Pixel Buds Pro 2",
        "description": "Tensor A1 chip, Conversation Detection, ANC, 8h + 22h battery, IPX4.",
        "price": 229.99,
        "stock_quantity": 38,
        "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    },
    {
        "name": "Anker Soundcore Liberty 4 NC",
        "description": "98% max noise reduction, LDAC, 10h + 50h battery, IPX4 — budget champion.",
        "price": 79.99,
        "stock_quantity": 90,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    },
    {
        "name": "Sennheiser Momentum True Wireless 4",
        "description": "Adaptive ANC, Adaptive Transparency, 7.5h + 30h, AURACAST, aptX Lossless.",
        "price": 259.99,
        "stock_quantity": 35,
        "image_url": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
    },
]

# ── Insert Products ───────────────────────────────────────────────────────────

def insert_products(product_list: list, category: Category, label: str):
    added = 0
    skipped = 0
    for p in product_list:
        exists = db.query(Product).filter(Product.name == p["name"]).first()
        if exists:
            skipped += 1
            continue
        product = Product(
            name=p["name"],
            description=p["description"],
            price=p["price"],
            stock_quantity=p["stock_quantity"],
            image_url=p["image_url"],
            category_id=category.id,
        )
        db.add(product)
        added += 1
    print(f"  {label}: {added} added, {skipped} already existed.")
    return added


try:
    print("\nSeeding products...\n")
    total = 0
    total += insert_products(phones,  phones_cat,  "Mobile Phones (10)")
    total += insert_products(laptops, laptops_cat, "Laptops       (15)")
    total += insert_products(tablets, tablets_cat, "Tablets        (5)")
    total += insert_products(earbuds, earbuds_cat, "Earbuds       (10)")
    db.commit()
    print(f"\nDone! {total} new products inserted into the database.\n")
except Exception as e:
    db.rollback()
    print(f"\nError: {e}\n")
    raise
finally:
    db.close()
