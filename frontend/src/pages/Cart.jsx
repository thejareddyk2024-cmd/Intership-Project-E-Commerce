import { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Cart() {
    const [cart, setCart] = useState([]);
    
    // Promo code states
    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [promoMessage, setPromoMessage] = useState({ type: "", text: "" });
    const [applyingPromo, setApplyingPromo] = useState(false);

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

    const applyPromo = async () => {
        if (!promoCode.trim()) return;
        setApplyingPromo(true);
        setPromoMessage({ type: "", text: "" });
        try {
            const token = localStorage.getItem("token");
            const response = await api.post("/api/v1/orders/validate-promo", { promo_code: promoCode }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.valid) {
                setDiscountPercent(response.data.discount_percent);
                setAppliedPromo(promoCode);
                setPromoMessage({ type: "success", text: response.data.message });
            } else {
                setDiscountPercent(0);
                setAppliedPromo("");
                setPromoMessage({ type: "error", text: response.data.message });
            }
        } catch (error) {
            setDiscountPercent(0);
            setAppliedPromo("");
            setPromoMessage({ 
                type: "error", 
                text: typeof error.response?.data?.detail === 'string' 
                    ? error.response.data.detail 
                    : error.response?.data?.detail?.[0]?.msg 
                        || error.message 
                        || "Error validating promo code." 
            });
        } finally {
            setApplyingPromo(false);
        }
    };

    const checkout = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = discountPercent > 0 ? { promo_code: appliedPromo } : {};
            const response = await api.post("/api/v1/orders/checkout", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.checkout_url) {
                // Redirect to Stripe or simulated URL
                window.location.href = response.data.checkout_url;
            } else {
                alert("Checkout failed: No checkout URL provided");
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Checkout failed");
        }
    };

    // Calculate totals dynamically
    const subtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
    const discountAmount = subtotal * discountPercent;
    const finalTotal = subtotal - discountAmount;

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
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-brand-600 dark:text-brand-400">${item.product?.price}</span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                    Qty: {item.quantity}
                                                </span>
                                            </div>
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
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 text-sm">
                                <span>Subtotal ({cart.length} items)</span>
                                <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>

                            {discountPercent > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                        <Tag size={14} />
                                        Promo Discount ({discountPercent * 100}%)
                                    </span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 text-sm">
                                <span>Shipping</span>
                                <span className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider text-xs">Free</span>
                            </div>
                        </div>

                        {/* Promo Code Input */}
                        <div className="mb-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Promo Code</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="e.g. SUMMER20"
                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 uppercase dark:text-white"
                                />
                                <button 
                                    onClick={applyPromo}
                                    disabled={applyingPromo || !promoCode}
                                    className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    {applyingPromo ? "..." : "Apply"}
                                </button>
                            </div>
                            {promoMessage.text && (
                                <p className={`mt-2 text-xs font-bold ${promoMessage.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {promoMessage.text}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-slate-900 dark:text-white text-lg">Total</span>
                                <div className="text-right">
                                    {discountPercent > 0 && (
                                        <span className="text-sm text-slate-400 line-through block mb-0.5">${subtotal.toFixed(2)}</span>
                                    )}
                                    <span className="font-extrabold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent text-3xl leading-none">
                                        ${finalTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-brand-500/20 active:scale-95 text-lg"
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