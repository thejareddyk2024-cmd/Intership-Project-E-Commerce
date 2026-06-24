import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/v1/auth/login", { email, password });
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("full_name", response.data.full_name);
            navigate("/products");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh] w-full px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-3xl pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 dark:bg-brand-900/30 rounded-2xl mb-4 text-brand-600 dark:text-brand-400">
                        <LogIn size={32} />
                    </div>
                    <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Enter your credentials to continue
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-slate-200"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-slate-200"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-brand-500/25 mt-6"
                    >
                        Sign In
                    </motion.button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors">
                            Sign Up Free
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;