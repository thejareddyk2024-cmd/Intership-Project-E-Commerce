import { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/cart", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/api/v1/cart/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(prev => prev.filter(item => item.id !== cartId));
        } catch (error) {
            console.log(error);
            alert("Failed to remove item");
        }
    };

    const checkout = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/api/v1/orders/checkout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Order placed successfully!");
            fetchCart();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Checkout failed");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Shopping <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">Cart</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage your selected items and proceed to checkout.
                </p>
            </header>

            {cart.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center py-24 px-4 shadow-sm"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-full mb-6 text-brand-500 dark:text-brand-400">
                        <ShoppingCart size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your cart is empty</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        Looks like you haven't added anything yet. Explore our products and find something you love.
                    </p>
                    <Link to="/products" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white py-3 px-8 rounded-xl font-bold transition-all shadow-md active:scale-95">
                        Explore Products <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    key={item.id} 
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center font-bold text-brand-700 dark:text-brand-400 border border-brand-100 dark:border-brand-800 overflow-hidden shrink-0">
                                            {item.product?.image_url ? (
                                                <img src={item.product.image_url} alt={item.product?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                `#${item.product_id}`
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                                                {item.product?.name || `Product #${item.product_id}`}
                                            </h5>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:sticky lg:top-24 shadow-sm"
                    >
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Order Summary</h4>
                        <div className="flex justify-between items-center mb-4 text-slate-600 dark:text-slate-300">
                            <span>Items</span>
                            <span className="font-semibold">{cart.length}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-slate-600 dark:text-slate-300">
                            <span>Shipping</span>
                            <span className="font-bold text-green-600 dark:text-green-400">FREE</span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 my-6" />
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-bold text-slate-900 dark:text-white text-lg">Total</span>
                            <span className="font-extrabold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent text-xl">Ready</span>
                        </div>
                        <button
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-brand-500/20 active:scale-95"
                            onClick={checkout}
                        >
                            Proceed to Checkout
                        </button>
                        <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-4">
                            Secure checkout powered by ShopSmart-AI
                        </p>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}

export default Cart;