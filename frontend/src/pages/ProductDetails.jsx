import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { ShoppingCart, Heart, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/api/v1/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/api/v1/reviews/${id}`);
            setReviews(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const submitReview = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/api/v1/reviews",
                { rating, comment, product_id: Number(id) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComment("");
            setRating(5);
            fetchReviews();
            alert("Review added!");
        } catch (error) {
            console.log(error);
            alert("Failed to add review");
        }
    };

    const addToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/api/v1/cart",
                { product_id: Number(id), quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Added to cart!");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Failed to add to cart");
        }
    };

    const addToWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/api/v1/wishlist",
                { product_id: Number(id) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Added to wishlist!");
        } catch (error) {
            console.log(error);
            alert("Failed to add to wishlist");
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
            {/* Breadcrumb */}
            <nav className="flex text-sm text-slate-500 dark:text-slate-400 mb-8 items-center space-x-2">
                <a href="/products" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Products</a>
                <ChevronRight size={16} />
                <span className="text-slate-900 dark:text-slate-200 font-medium">{product.name}</span>
            </nav>

            {/* ── Product Main ────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Image */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-lg"
                >
                    <img
                        src={product.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover max-h-[600px]"
                    />
                </motion.div>

                {/* Info */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex flex-col"
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-lg font-bold border border-amber-200 dark:border-amber-800/50">
                            <Star size={16} className="fill-current" />
                            {averageRating}
                        </div>
                        <span className="text-slate-500 dark:text-slate-400">
                            ({reviews.length} Reviews)
                        </span>
                    </div>

                    <p className="text-4xl font-black text-brand-600 dark:text-brand-400 mb-6">
                        ${product.price}
                    </p>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg">
                        {product.description}
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Availability</span>
                            <span className={`font-bold ${product.stock_quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Category ID</span>
                            <span className="font-bold text-slate-900 dark:text-white">{product.category_id}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-auto">
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-brand-500/30" 
                            onClick={addToCart}
                        >
                            <ShoppingCart size={20} />
                            Add to Cart
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/50 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-4 px-6 rounded-xl font-bold transition-all" 
                            onClick={addToWishlist}
                        >
                            <Heart size={20} />
                            Wishlist
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* ── Reviews ────────────────────────────────── */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                    Customer Reviews
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {reviews.length === 0 ? (
                            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 text-brand-700 dark:text-brand-300 p-6 rounded-2xl">
                                No reviews yet. Be the first to review this product!
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm"
                                >
                                    <div className="flex gap-1 mb-3 text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < review.rating ? "fill-current" : "text-slate-300 dark:text-slate-600"} />
                                        ))}
                                    </div>
                                    <p className="text-slate-800 dark:text-slate-200 mb-3 leading-relaxed">
                                        {review.comment}
                                    </p>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        User #{review.user_id}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Write Review */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                                Write a Review
                            </h3>

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rating</label>
                                <select
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-slate-200"
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                                    <option value={3}>⭐⭐⭐ (3)</option>
                                    <option value={2}>⭐⭐ (2)</option>
                                    <option value={1}>⭐ (1)</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Comment</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-slate-200 resize-y min-h-[120px]"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience..."
                                />
                            </div>
                            <button 
                                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-md active:scale-95" 
                                onClick={submitReview}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ProductDetails;