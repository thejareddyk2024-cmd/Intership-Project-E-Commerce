import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get("session_id");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionId) {
            confirmOrder();
        } else {
            navigate("/orders");
        }
    }, [sessionId]);

    const confirmOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post(`/api/v1/orders/checkout/success?session_id=${sessionId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto px-4 py-24 text-center"
        >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-8">
                <CheckCircle2 size={48} />
            </div>
            
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                Payment Successful!
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10">
                Thank you for your purchase. Your order has been placed and is now being processed.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => navigate("/orders")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white py-3.5 px-8 rounded-xl font-bold transition-all shadow-md active:scale-95"
                >
                    <Package size={20} />
                    Track Order
                </button>
                <button
                    onClick={() => navigate("/products")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-3.5 px-8 rounded-xl font-bold transition-all shadow-sm active:scale-95"
                >
                    Continue Shopping
                    <ArrowRight size={20} />
                </button>
            </div>
        </motion.div>
    );
}

export default CheckoutSuccess;
