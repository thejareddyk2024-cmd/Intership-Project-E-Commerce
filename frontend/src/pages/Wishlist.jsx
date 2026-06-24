import { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, Heart, ArrowRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/wishlist", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const removeFromWishlist = async (wishlistId) => {
        const confirmed = window.confirm("Remove this item from wishlist?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/api/v1/wishlist/${wishlistId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(prev => prev.filter(item => item.id !== wishlistId));
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Failed to remove item");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Saved <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Favorites</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Your personal collection of favorite tech products.
                </p>
            </header>

            {wishlist.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center py-24 px-4 shadow-sm"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full mb-6 text-red-500 dark:text-red-400">
                        <Heart size={40} className="fill-current opacity-20" />
                        <Heart size={40} className="absolute" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your wishlist is waiting</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        Save items you love to find them later and keep track of your most wanted tech.
                    </p>
                    <Link to="/products" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white py-3 px-8 rounded-xl font-bold transition-all shadow-md active:scale-95">
                        Browse Products <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {wishlist.map((item) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                key={item.id} 
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex gap-4 mb-5 flex-1">
                                    <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                                        {item.product?.image_url ? (
                                            <img 
                                                src={item.product.image_url} 
                                                alt={item.product.name} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="font-bold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2">
                                            {item.product?.name || `Product #${item.product_id}`}
                                        </h5>
                                        <p className="font-extrabold text-brand-600 dark:text-brand-400 mb-2">
                                            ${item.product?.price}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-auto">
                                            Added to favorites
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <Link 
                                        to={`/product/${item.product_id}`} 
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2.5 px-3 rounded-xl font-semibold text-sm transition-colors"
                                    >
                                        <Eye size={16} />
                                        View
                                    </Link>
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="flex items-center justify-center p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}

export default Wishlist;