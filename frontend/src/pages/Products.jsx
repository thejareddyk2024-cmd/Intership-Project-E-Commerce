import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const CATEGORIES = [
    { icon: "📱", label: "Mobile Phones", filter: "Mobile Phones" },
    { icon: "💻", label: "Laptops", filter: "Laptops" },
    { icon: "📟", label: "Tablets", filter: "Tablets" },
    { icon: "🎧", label: "Earbuds", filter: "Earbuds" },
];

function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [activeCategory, setActiveCategory] = useState("");

    useEffect(() => {
        fetchProducts();
    }, [search, minPrice, maxPrice]);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/api/v1/products", {
                params: {
                    search,
                    min_price: minPrice || undefined,
                    max_price: maxPrice || undefined
                }
            });
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/api/v1/wishlist",
                { product_id: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Added to wishlist!");
        } catch (error) {
            console.log(error);
            alert("Failed to add to wishlist");
        }
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/api/v1/cart",
                { product_id: productId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Added to cart!");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Failed to add to cart");
        }
    };

    // Filter by category (client-side based on category name match)
    let filteredProducts = [...products];

    if (activeCategory) {
        // Match products whose category_id corresponds to the active category
        // Since we seeded with known category names, we filter by searching the product name patterns
        const categoryKeywords = {
            "Mobile Phones": ["Galaxy S", "Galaxy A", "iPhone", "Pixel", "OnePlus 12", "Xiaomi 14", "Motorola", "Nothing Phone", "Realme GT"],
            "Laptops": ["MacBook", "XPS", "ThinkPad", "Zephyrus", "Spectre", "Surface Laptop", "Razer Blade", "IdeaPad", "Swift Go", "Galaxy Book", "Titan", "Pavilion", "Zenbook", "Gram 16"],
            "Tablets": ["iPad", "Galaxy Tab", "Surface Pro", "Tab P12"],
            "Earbuds": ["AirPods", "WF-1000", "Galaxy Buds", "QuietComfort", "Ear (2)", "Elite 10", "Buds Pro", "Pixel Buds", "Soundcore", "Momentum"],
        };
        const keywords = categoryKeywords[activeCategory] || [];
        filteredProducts = filteredProducts.filter(p =>
            keywords.some(kw => p.name.includes(kw))
        );
    }

    if (sortBy === "priceLow") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "priceHigh") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    return (
        <div className="page-wrapper">
            {/* ── Hero Section ───────────────────────────────── */}
            <section className="hero-section">
                <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
                    <div style={{ maxWidth: "600px" }}>
                        <h1>Discover Premium Tech Products</h1>
                        <p style={{ marginTop: "0.75rem", lineHeight: 1.7 }}>
                            Explore our curated collection of AI-powered gadgets, future-ready hardware, and premium accessories.
                            {" "}<strong>{products.length}</strong> products available.
                        </p>
                    </div>
                </div>
            </section>

            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>

                {/* ── Browse by Category ─────────────────────── */}
                <section style={{ padding: "2rem 0 1rem" }}>
                    <h2 className="section-title" style={{ marginBottom: "1rem" }}>Browse by Category</h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: "0.75rem"
                    }}>
                        <div
                            className={`category-card ${activeCategory === "" ? "active" : ""}`}
                            onClick={() => setActiveCategory("")}
                        >
                            <span className="category-icon">🛍️</span>
                            <span className="category-label">All Products</span>
                        </div>
                        {CATEGORIES.map(cat => (
                            <div
                                key={cat.filter}
                                className={`category-card ${activeCategory === cat.filter ? "active" : ""}`}
                                onClick={() => setActiveCategory(activeCategory === cat.filter ? "" : cat.filter)}
                            >
                                <span className="category-icon">{cat.icon}</span>
                                <span className="category-label">{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Filter Bar ─────────────────────────────── */}
                <section style={{ padding: "1rem 0" }}>
                    <div className="filter-bar" style={{
                        display: "flex",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                        alignItems: "end"
                    }}>
                        <div style={{ flex: "2", minWidth: "180px" }}>
                            <label className="form-label">Search</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div style={{ flex: "1", minWidth: "120px" }}>
                            <label className="form-label">Min Price</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="$0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <div style={{ flex: "1", minWidth: "120px" }}>
                            <label className="form-label">Max Price</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="$9999"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div style={{ flex: "1.5", minWidth: "160px" }}>
                            <label className="form-label">Sort By</label>
                            <select
                                className="form-control"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="">Default</option>
                                <option value="name">Name A-Z</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* ── Results Count ──────────────────────────── */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0 0.25rem"
                }}>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
                        Showing <strong style={{ color: "#0f172a" }}>{filteredProducts.length}</strong> products
                        {activeCategory && <> in <strong style={{ color: "#0f766e" }}>{activeCategory}</strong></>}
                    </p>
                </div>

                {/* ── Product Grid ───────────────────────────── */}
                <section style={{ padding: "1rem 0 3rem" }}>
                    <div className="product-grid">
                        {filteredProducts.map((product) => (
                            <div key={product.id}>
                                <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div className="glass-card product-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                        {/* Product Image */}
                                        <div className="product-image-wrapper">
                                            <img
                                                src={product.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"}
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                                <h5 style={{
                                                    fontSize: "0.9375rem",
                                                    fontWeight: 700,
                                                    margin: 0,
                                                    flex: 1,
                                                    marginRight: "0.75rem",
                                                    lineHeight: 1.3,
                                                    color: "#0f172a"
                                                }}>
                                                    {product.name}
                                                </h5>
                                            </div>

                                            <p className="price-tag" style={{ marginBottom: "0.5rem" }}>
                                                ${product.price}
                                            </p>

                                            <p style={{
                                                fontSize: "0.8125rem",
                                                color: "#64748b",
                                                lineHeight: 1.5,
                                                flex: 1,
                                                marginBottom: "1rem",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden"
                                            }}>
                                                {product.description}
                                            </p>

                                            <div style={{ marginTop: "auto" }}>
                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
                                                    <span className={`stock-badge ${product.stock_quantity > 20 ? "in-stock" : "low-stock"}`}>
                                                        {product.stock_quantity > 20 ? `${product.stock_quantity} in stock` : `Only ${product.stock_quantity} left`}
                                                    </span>
                                                </div>

                                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ flex: 1, fontSize: "0.8125rem", padding: "8px 12px" }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addToCart(product.id);
                                                        }}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        style={{ width: "42px", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addToWishlist(product.id);
                                                        }}
                                                    >
                                                        ♥
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Products;