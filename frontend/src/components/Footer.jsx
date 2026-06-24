import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Column */}
                <div className="md:col-span-1">
                    <span className="text-xl font-extrabold text-white mb-3 block">
                        ShopSmart-AI
                    </span>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Pioneering the future of intelligent e-commerce. Your AI-powered destination for premium tech gadgets.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                        Shop
                    </h3>
                    <ul className="flex flex-col space-y-2">
                        <li><Link to="/products" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">All Products</Link></li>
                        <li><Link to="/cart" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Cart</Link></li>
                        <li><Link to="/wishlist" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Wishlist</Link></li>
                        <li><Link to="/orders" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Orders</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                        Company
                    </h3>
                    <ul className="flex flex-col space-y-2">
                        <li><a href="#" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">About Us</a></li>
                        <li><a href="#" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Support</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                        Contact
                    </h3>
                    <ul className="flex flex-col space-y-2">
                        <li className="text-sm text-slate-400">support@shopsmart-ai.com</li>
                        <li className="text-sm text-slate-400">India</li>
                    </ul>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} ShopSmart-AI. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;