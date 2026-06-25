import { useEffect, useState } from "react";
import api from "../services/api";
import { Package, Users, ShoppingCart, DollarSign, Star, Heart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get("/api/v1/analytics/dashboard");
            setStats(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!stats) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Products",
            value: stats.total_products,
            icon: <Package size={24} />,
            color: "blue"
        },
        {
            title: "Total Users",
            value: stats.total_users,
            icon: <Users size={24} />,
            color: "purple"
        },
        {
            title: "Total Orders",
            value: stats.total_orders,
            icon: <ShoppingCart size={24} />,
            color: "brand"
        },
        {
            title: "Total Revenue",
            value: `$${Number(stats.total_revenue).toFixed(2)}`,
            icon: <DollarSign size={24} />,
            color: "emerald"
        }
    ];

    const getColorClasses = (color) => {
        switch (color) {
            case "blue": return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50";
            case "purple": return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50";
            case "brand": return "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-brand-100 dark:border-brand-800/50";
            case "emerald": return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50";
            default: return "bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/50";
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <TrendingUp className="text-brand-500" />
                        Admin <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Overview of your store performance.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={card.title} 
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 border ${getColorClasses(card.color)}`}>
                            {card.icon}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                            {card.value}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            {card.title}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group"
                >
                    <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Star size={32} className="fill-current" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                        Top Rated Product
                    </h4>
                    <h5 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4 line-clamp-1">
                        {stats.top_rated_product}
                    </h5>
                    <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 px-4 py-2 rounded-full font-bold">
                        Average Rating: {stats.top_rated_score} <Star size={16} className="fill-current" />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group"
                >
                    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Heart size={32} className="fill-current" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                        Most Wishlisted
                    </h4>
                    <h5 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4 line-clamp-1">
                        {stats.most_wishlisted_product}
                    </h5>
                    <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full font-bold">
                        Wishlisted {stats.wishlist_count} times
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Sales Over Time Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm"
                >
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Sales Over Time</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.sales_over_time} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} opacity={0.1} />
                                <XAxis dataKey="date" stroke="#8884d8" tick={{ fill: '#8884d8' }} tickMargin={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#8884d8" tick={{ fill: '#8884d8' }} tickMargin={10} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`$${value}`, "Sales"]}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Revenue by Category Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm"
                >
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Revenue by Category</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={stats.revenue_by_category} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={80} 
                                    outerRadius={110} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.revenue_by_category?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`$${value}`, "Revenue"]}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default AdminDashboard;