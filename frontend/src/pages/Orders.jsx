import { useEffect, useState } from "react";
import api from "../services/api";
import { Package, ArrowRight, Clock, CheckCircle2, AlertCircle, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getStatusConfig = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return { 
                    bg: "bg-green-50 dark:bg-green-900/20", 
                    text: "text-green-700 dark:text-green-400", 
                    border: "border-green-200 dark:border-green-800/50",
                    icon: <CheckCircle2 size={16} />
                };
            case "pending":
                return { 
                    bg: "bg-amber-50 dark:bg-amber-900/20", 
                    text: "text-amber-700 dark:text-amber-500", 
                    border: "border-amber-200 dark:border-amber-800/50",
                    icon: <Clock size={16} />
                };
            default:
                return { 
                    bg: "bg-blue-50 dark:bg-blue-900/20", 
                    text: "text-blue-700 dark:text-blue-400", 
                    border: "border-blue-200 dark:border-blue-800/50",
                    icon: <AlertCircle size={16} />
                };
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
                    Order <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">History</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Track and manage your past purchases.
                </p>
            </header>

            {orders.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center py-24 px-4 shadow-sm"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-full mb-6 text-brand-500 dark:text-brand-400">
                        <Package size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No orders yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        Your order history will appear here once you make a purchase.
                    </p>
                    <Link to="/products" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white py-3 px-8 rounded-xl font-bold transition-all shadow-md active:scale-95">
                        Start Shopping <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map((order, index) => {
                        const statusConfig = getStatusConfig(order.status);
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={order.id} 
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center font-bold text-brand-700 dark:text-brand-400 border border-brand-100 dark:border-brand-800/50">
                                            #{String(order.id).slice(-4)}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                                                Order #{order.id}
                                            </h5>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                Placed on {new Date().toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total</div>
                                            <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">${order.total_amount}</div>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                            {statusConfig.icon}
                                            {order.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-6 mt-4">
                                    <div className="mb-6">
                                        <h6 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Order Status</h6>
                                        <div className="relative">
                                            {/* Track Line */}
                                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -translate-y-1/2 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ 
                                                        width: order.status.toLowerCase() === 'delivered' ? '100%' : 
                                                               order.status.toLowerCase() === 'shipped' ? '66%' : 
                                                               order.status.toLowerCase() === 'processing' ? '33%' : '0%' 
                                                    }}
                                                    className="h-full bg-brand-500"
                                                />
                                            </div>
                                            
                                            {/* Steps */}
                                            <div className="relative flex justify-between">
                                                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, stepIdx) => {
                                                    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
                                                    const currentIndex = statuses.indexOf(order.status.toLowerCase());
                                                    const isCompleted = stepIdx <= currentIndex;
                                                    const isCurrent = stepIdx === currentIndex;
                                                    
                                                    let StepIcon = Clock;
                                                    if (step === 'Processing') StepIcon = Package;
                                                    if (step === 'Shipped') StepIcon = Truck;
                                                    if (step === 'Delivered') StepIcon = CheckCircle2;
                                                    
                                                    return (
                                                        <div key={step} className="flex flex-col items-center gap-2">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 relative z-10 transition-colors ${
                                                                isCompleted 
                                                                    ? 'bg-brand-500 text-white' 
                                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                                                            } ${isCurrent ? 'ring-4 ring-brand-100 dark:ring-brand-900/30' : ''}`}>
                                                                <StepIcon size={16} />
                                                            </div>
                                                            <span className={`text-xs font-bold ${
                                                                isCurrent ? 'text-brand-600 dark:text-brand-400' : 
                                                                isCompleted ? 'text-slate-700 dark:text-slate-300' : 
                                                                'text-slate-400 dark:text-slate-500'
                                                            }`}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {order.items && order.items.length > 0 && (
                                        <div>
                                            <h6 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Items in this order:</h6>
                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                                                {item.product?.image_url ? (
                                                                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Package size={16} className="text-slate-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.product?.name || `Product #${item.product_id}`}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}

export default Orders;