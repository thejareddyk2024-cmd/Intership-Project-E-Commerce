import { useState, useEffect } from "react";
import { User, Mail, Lock, MapPin, Save, Shield, ShoppingBag, Heart, Settings, Clock, Activity, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

function ProfilePage() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        shipping_address: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [activeTab, setActiveTab] = useState("settings"); // "settings" or "activity"

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, ordersRes, wishlistRes] = await Promise.all([
                api.get("/api/v1/auth/me"),
                api.get("/api/v1/orders").catch(() => ({ data: [] })),
                api.get("/api/v1/wishlist").catch(() => ({ data: { items: [] } }))
            ]);
            
            setFormData({
                full_name: profileRes.data.full_name || "",
                email: profileRes.data.email || "",
                password: "",
                shipping_address: profileRes.data.shipping_address || ""
            });
            setOrders(ordersRes.data || []);
            setWishlist(wishlistRes.data?.items || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
            setMessage({ type: "error", text: "Failed to load profile data." });
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            // Only send password if it's not empty
            const payload = { ...formData };
            if (!payload.password) {
                delete payload.password;
            }

            const response = await api.put("/api/v1/auth/me", payload);
            
            // Update local storage if name changed
            if (response.data.full_name) {
                localStorage.setItem("full_name", response.data.full_name);
            }

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setFormData({ ...formData, password: "" }); // clear password field
        } catch (error) {
            console.error("Failed to update profile:", error);
            setMessage({ 
                type: "error", 
                text: error.response?.data?.detail || "Failed to update profile." 
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    };
    const role = localStorage.getItem("role") || "customer";

    const totalSpent = orders.reduce((acc, order) => acc + order.total_amount, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <User className="text-brand-500" size={36} />
                    Account <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">Hub</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
                    Manage your profile, preferences, and view recent activity.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Summary & Quick Stats */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-span-1 space-y-6"
                >
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="h-32 bg-gradient-to-br from-brand-400 to-brand-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 dark:bg-black/20" style={{ backdropFilter: 'blur(10px)' }}></div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-300/30 rounded-full blur-2xl"></div>
                        </div>
                        
                        <div className="px-6 pb-6 relative text-center">
                            <div className="w-24 h-24 mx-auto -mt-12 bg-white dark:bg-slate-800 rounded-full p-2 relative z-10 shadow-sm">
                                <div className="w-full h-full bg-gradient-to-br from-brand-50 to-brand-100 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center text-3xl font-black text-brand-600 dark:text-brand-400 shadow-inner">
                                    {getInitials(formData.full_name)}
                                </div>
                            </div>

                            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                                {formData.full_name || "User"}
                            </h2>
                            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-full capitalize">
                                <Shield size={14} className="text-brand-500" />
                                {role} Account
                            </div>

                            <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-6 flex flex-col gap-4 text-left">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</p>
                                        <p className="text-sm font-medium truncate">{formData.email || 'Not set'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</p>
                                        <p className="text-sm font-medium truncate">{formData.shipping_address ? "Saved Address" : "Not Set"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-2xl border border-brand-100 dark:border-brand-800/50 flex flex-col items-center justify-center text-center">
                                <ShoppingBag className="text-brand-500 mb-2" size={24} />
                                <span className="text-2xl font-black text-brand-700 dark:text-brand-400">{orders.length}</span>
                                <span className="text-xs font-semibold text-brand-600/70 dark:text-brand-400/70 uppercase tracking-wider">Orders</span>
                            </div>
                            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800/50 flex flex-col items-center justify-center text-center">
                                <Heart className="text-rose-500 mb-2" size={24} />
                                <span className="text-2xl font-black text-rose-700 dark:text-rose-400">{wishlist.length}</span>
                                <span className="text-xs font-semibold text-rose-600/70 dark:text-rose-400/70 uppercase tracking-wider">Wishlist</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Tabbed Content (Settings & Activity) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-span-1 lg:col-span-2"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full flex flex-col">
                        
                        {/* Tabs Header */}
                        <div className="flex border-b border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "settings" ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 bg-brand-50/50 dark:bg-brand-900/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                            >
                                <Settings size={18} />
                                Update Information
                            </button>
                            <button
                                onClick={() => setActiveTab("activity")}
                                className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "activity" ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 bg-brand-50/50 dark:bg-brand-900/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                            >
                                <Activity size={18} />
                                Recent Activity
                            </button>
                        </div>

                        <div className="p-8 flex-1">
                            <AnimatePresence mode="wait">
                                {activeTab === "settings" ? (
                                    <motion.div
                                        key="settings"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {message.text && (
                                            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                                                {message.text}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                        Full Name
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <User className="h-5 w-5 text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="full_name"
                                                            value={formData.full_name}
                                                            onChange={handleChange}
                                                            className="pl-11 w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all dark:text-white"
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                        Email Address
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Mail className="h-5 w-5 text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="pl-11 w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all dark:text-white"
                                                            placeholder="john@example.com"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                                                    <span>New Password</span>
                                                    <span className="text-xs font-normal text-slate-400">Leave blank to keep current</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="pl-11 w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all dark:text-white"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    Default Shipping Address
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                                                        <MapPin className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <textarea
                                                        name="shipping_address"
                                                        value={formData.shipping_address}
                                                        onChange={handleChange}
                                                        rows="3"
                                                        className="pl-11 w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all dark:text-white resize-none"
                                                        placeholder="123 Smart St, Tech City, CA 90210"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                                <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                                                    Keep your information secure.
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 w-full sm:w-auto justify-center"
                                                >
                                                    {saving ? (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                    ) : (
                                                        <Save size={20} />
                                                    )}
                                                    {saving ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="activity"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h3>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Spent: ${totalSpent.toFixed(2)}</span>
                                        </div>

                                        {orders.length === 0 ? (
                                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                                                <Package className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                                                <p className="text-slate-600 dark:text-slate-400 font-medium">You haven't placed any orders yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {orders.slice(0, 3).map((order) => (
                                                    <div key={order.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-md transition-shadow">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                                <ShoppingBag size={20} className="text-slate-600 dark:text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white">Order #{order.id}</p>
                                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                                                    <Clock size={14} />
                                                                    {new Date(order.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                                                            <span className="font-bold text-lg text-slate-900 dark:text-white">
                                                                ${order.total_amount.toFixed(2)}
                                                            </span>
                                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                                                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                                order.status === 'processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {orders.length > 3 && (
                                                    <div className="text-center pt-2">
                                                        <a href="/orders" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                                                            View All Orders &rarr;
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ProfilePage;
