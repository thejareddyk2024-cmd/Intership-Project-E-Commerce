import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Search } from "lucide-react";

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

    let filteredProducts = [...products];

    if (activeCategory) {
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
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col min-h-screen pb-12"
        >
            {/* ── Hero Section ───────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white py-16">
                <div className="absolute -top-[50%] -right-[20%] w-[600px] h-[600px] rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-white/5 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            Discover Premium Tech Products
                        </h1>
                        <p className="text-lg text-brand-50/80 leading-relaxed">
                            Explore our curated collection of AI-powered gadgets, future-ready hardware, and premium accessories.
                            {" "}<strong>{products.length}</strong> products available.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">

                {/* ── Browse by Category ─────────────────────── */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <button
                            className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all ${
                                activeCategory === "" 
                                ? "bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-900/30 dark:border-brand-500 dark:text-brand-300" 
                                : "text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                            }`}
                            onClick={() => setActiveCategory("")}
                        >
                            <span className="text-3xl">🛍️</span>
                            <span className="text-sm font-semibold">All Products</span>
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.filter}
                                className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all ${
                                    activeCategory === cat.filter 
                                    ? "bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-900/30 dark:border-brand-500 dark:text-brand-300" 
                                    : "text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                                }`}
                                onClick={() => setActiveCategory(activeCategory === cat.filter ? "" : cat.filter)}
                            >
                                <span className="text-3xl">{cat.icon}</span>
                                <span className="text-sm font-semibold">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── Filter Bar ─────────────────────────────── */}
                <section className="mb-6">
                    <div className="glass-card rounded-2xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-4">
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-slate-200"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Min Price</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-slate-200"
                                    placeholder="$0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Max Price</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-slate-200"
                                    placeholder="$9999"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Sort By</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-slate-200"
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
                    </div>
                </section>

                {/* ── Results Count ──────────────────────────── */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> products
                        {activeCategory && <> in <strong className="text-brand-700 dark:text-brand-400">{activeCategory}</strong></>}
                    </p>
                </div>

                {/* ── Product Grid ───────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={product.id}
                        >
                            <Link to={`/product/${product.id}`} className="block h-full outline-none">
                                <div className="glass-card flex flex-col h-full rounded-2xl overflow-hidden group">
                                    {/* Product Image */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <img
                                            src={product.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"}
                                            alt={product.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {/* Overlay gradient for text readability if needed */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-col flex-1 p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <div className="text-xl font-extrabold text-brand-600 dark:text-brand-400 mb-3">
                                            ${product.price}
                                        </div>

                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                                            {product.description}
                                        </p>

                                        <div className="mt-auto flex flex-col gap-3">
                                            <div className="flex items-center">
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    product.stock_quantity > 20 
                                                    ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" 
                                                    : "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400"
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${product.stock_quantity > 20 ? "bg-green-500" : "bg-orange-500"}`} />
                                                    {product.stock_quantity > 20 ? `${product.stock_quantity} in stock` : `Only ${product.stock_quantity} left`}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addToCart(product.id);
                                                    }}
                                                >
                                                    <ShoppingCart size={16} />
                                                    Add to Cart
                                                </button>
                                                <button
                                                    className="flex items-center justify-center p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-95"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addToWishlist(product.id);
                                                    }}
                                                    title="Add to Wishlist"
                                                >
                                                    <Heart size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default Products;