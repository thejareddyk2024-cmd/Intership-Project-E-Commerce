import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const role = localStorage.getItem("role");
    const fullName = localStorage.getItem("full_name");
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("full_name");
        setMenuOpen(false);
        navigate("/");
    };

    const closeMenu = () => setMenuOpen(false);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
            onClick={closeMenu}
        >
            {children}
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/products" className="flex items-center gap-2" onClick={closeMenu}>
                            <span className="text-xl font-extrabold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                                ShopSmart-AI
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {role === "admin" && <NavLink to="/admin-dashboard">Dashboard</NavLink>}
                        <NavLink to="/products">Products</NavLink>
                        <NavLink to="/wishlist">Wishlist</NavLink>
                        <NavLink to="/cart">Cart</NavLink>
                        <NavLink to="/orders">Orders</NavLink>
                        {role === "admin" && (
                            <>
                                <NavLink to="/admin/products">Manage Products</NavLink>
                                <NavLink to="/admin/orders">Manage Orders</NavLink>
                            </>
                        )}
                        
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="flex items-center pl-4 border-l border-slate-200 dark:border-slate-700 ml-2">
                            {fullName && (
                                <span className="text-sm font-semibold text-brand-700 dark:text-brand-400 mr-4">
                                    {fullName}
                                </span>
                            )}
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 dark:text-slate-400 rounded-lg"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-slate-600 dark:text-slate-300 rounded-lg"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg"
                    >
                        <div className="px-4 pt-2 pb-4 flex flex-col space-y-1">
                            {role === "admin" && <NavLink to="/admin-dashboard">Dashboard</NavLink>}
                            <NavLink to="/products">Products</NavLink>
                            <NavLink to="/wishlist">Wishlist</NavLink>
                            <NavLink to="/cart">Cart</NavLink>
                            <NavLink to="/orders">Orders</NavLink>
                            {role === "admin" && (
                                <>
                                    <NavLink to="/admin/products">Manage Products</NavLink>
                                    <NavLink to="/admin/orders">Manage Orders</NavLink>
                                </>
                            )}
                            
                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
                            
                            <div className="flex items-center justify-between pt-2">
                                {fullName && (
                                    <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
                                        {fullName}
                                    </span>
                                )}
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;