import { useEffect, useState } from "react";
import api from "../services/api";
import { ClipboardList, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/admin/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const sortedOrders = response.data.sort((a, b) => b.id - a.id);
            setOrders(sortedOrders);
        } catch (error) {
            console.log(error);
            alert("Failed to fetch orders.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/api/v1/admin/orders/${orderId}/status`,
                null,
                {
                    params: { status: newStatus },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchOrders();
        } catch (error) {
            console.log(error);
            alert("Failed to update order status.");
        }
    };

    const getStatusConfig = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "delivered":
                return { 
                    bg: "bg-green-50 dark:bg-green-900/20", 
                    text: "text-green-700 dark:text-green-400", 
                    border: "border-green-200 dark:border-green-800/50",
                    icon: <CheckCircle2 size={14} />
                };
            case "processing":
            case "on the way":
            case "shipped":
                return { 
                    bg: "bg-amber-50 dark:bg-amber-900/20", 
                    text: "text-amber-700 dark:text-amber-500", 
                    border: "border-amber-200 dark:border-amber-800/50",
                    icon: <TrendingUp size={14} />
                };
            case "cancelled":
                return { 
                    bg: "bg-red-50 dark:bg-red-900/20", 
                    text: "text-red-700 dark:text-red-400", 
                    border: "border-red-200 dark:border-red-800/50",
                    icon: <AlertCircle size={14} />
                };
            case "pending":
            default:
                return { 
                    bg: "bg-blue-50 dark:bg-blue-900/20", 
                    text: "text-blue-700 dark:text-blue-400", 
                    border: "border-blue-200 dark:border-blue-800/50",
                    icon: <Clock size={14} />
                };
        }
    };

    if (loading) {
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
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]"
        >
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <ClipboardList className="text-brand-500" />
                        Manage <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">Orders</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        View and update all customer orders.
                    </p>
                </div>
            </header>

            {orders.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center py-24 px-4 shadow-sm"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-full mb-6 text-brand-500 dark:text-brand-400">
                        <ClipboardList size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No orders found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        There are currently no orders in the system.
                    </p>
                </motion.div>
            ) : (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Order ID</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User ID</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Amount</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {orders.map((order) => {
                                    const statusConfig = getStatusConfig(order.status);
                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                            <td className="py-4 px-6 text-sm font-bold text-slate-900 dark:text-white">
                                                #{order.id}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                                                User {order.user_id}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-sm font-extrabold text-brand-600 dark:text-brand-400">
                                                ${Number(order.total_amount).toFixed(2)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                                    {statusConfig.icon}
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="inline-flex relative">
                                                    <select
                                                        className="appearance-none pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="on the way">On the way</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default AdminOrders;
