import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { Users, Package, ArrowUpCircle, ArrowDownCircle, Shield, User } from "lucide-react";
import { motion } from "framer-motion";

function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const promote = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/api/v1/admin/promote/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("User promoted to Admin");
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to promote user");
        }
    };

    const demote = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/api/v1/admin/demote/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("User demoted to Customer");
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to demote user");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Users className="text-brand-500" />
                        User <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">Management</span>
                    </h1>
                </div>
                <Link to="/admin/products" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-2.5 px-6 rounded-xl font-bold transition-all shadow-sm">
                    <Package size={18} />
                    Manage Products
                </Link>
            </header>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{user.full_name}</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                            user.role === "admin" 
                                            ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50" 
                                            : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50"
                                        }`}>
                                            {user.role === "admin" ? <Shield size={14} /> : <User size={14} />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        {user.role === "customer" ? (
                                            <button
                                                className="inline-flex items-center justify-center gap-1.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-400 py-2 px-4 rounded-xl text-sm font-bold transition-colors"
                                                onClick={() => promote(user.id)}
                                            >
                                                <ArrowUpCircle size={16} />
                                                Promote
                                            </button>
                                        ) : (
                                            <button
                                                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-xl text-sm font-bold transition-colors"
                                                onClick={() => demote(user.id)}
                                            >
                                                <ArrowDownCircle size={16} />
                                                Demote
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}

export default AdminUsers;
