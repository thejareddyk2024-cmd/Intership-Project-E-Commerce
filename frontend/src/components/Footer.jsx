import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="site-footer">
            <div style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "3rem 1.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "2.5rem"
            }}>
                {/* Brand Column */}
                <div>
                    <span style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "white",
                        display: "block",
                        marginBottom: "0.75rem"
                    }}>
                        ShopSmart-AI
                    </span>
                    <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.7 }}>
                        Pioneering the future of intelligent e-commerce. Your AI-powered destination for premium tech gadgets.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "white",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.75rem"
                    }}>
                        Shop
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li><Link to="/products" style={{ fontSize: "0.875rem" }}>All Products</Link></li>
                        <li><Link to="/cart" style={{ fontSize: "0.875rem" }}>Cart</Link></li>
                        <li><Link to="/wishlist" style={{ fontSize: "0.875rem" }}>Wishlist</Link></li>
                        <li><Link to="/orders" style={{ fontSize: "0.875rem" }}>Orders</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "white",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.75rem"
                    }}>
                        Company
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li><a href="#" style={{ fontSize: "0.875rem" }}>About Us</a></li>
                        <li><a href="#" style={{ fontSize: "0.875rem" }}>Privacy Policy</a></li>
                        <li><a href="#" style={{ fontSize: "0.875rem" }}>Terms of Service</a></li>
                        <li><a href="#" style={{ fontSize: "0.875rem" }}>Support</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "white",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.75rem"
                    }}>
                        Contact
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li style={{ fontSize: "0.875rem", color: "#94a3b8" }}>support@shopsmart-ai.com</li>
                        <li style={{ fontSize: "0.875rem", color: "#94a3b8" }}>India</li>
                    </ul>
                </div>
            </div>

            {/* Copyright Bar */}
            <div style={{
                borderTop: "1px solid #1e293b",
                padding: "1rem 1.5rem",
                textAlign: "center",
                fontSize: "0.75rem",
                color: "#64748b"
            }}>
                &copy; {new Date().getFullYear()} ShopSmart-AI. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;