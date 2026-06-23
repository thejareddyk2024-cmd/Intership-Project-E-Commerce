import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();
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

    const linkStyle = {
        textDecoration: "none",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "#475569",
        padding: "8px 16px",
        borderRadius: "8px",
        transition: "all 0.2s"
    };

    return (
        <header className="navbar">
            <nav style={{
                maxWidth: "1280px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "64px",
                padding: "0 1.5rem",
                width: "100%",
                position: "relative"
            }}>
                <Link
                    to="/products"
                    style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                    onClick={closeMenu}
                >
                    <span className="gradient-text" style={{ fontSize: "1.35rem", fontWeight: 800 }}>
                        ShopSmart-AI
                    </span>
                </Link>

                {/* Hamburger Toggle */}
                <button
                    className="navbar-mobile-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

                {/* Navigation Links */}
                <div className={`navbar-links ${menuOpen ? "open" : ""}`} style={{
                    display: menuOpen ? undefined : undefined,
                    alignItems: "center",
                    gap: "2px"
                }}>
                    {role === "admin" && (
                        <Link to="/admin-dashboard" style={linkStyle} className="hover-white" onClick={closeMenu}>
                            Dashboard
                        </Link>
                    )}
                    <Link to="/products" style={linkStyle} className="hover-white" onClick={closeMenu}>
                        Products
                    </Link>
                    <Link to="/wishlist" style={linkStyle} className="hover-white" onClick={closeMenu}>
                        Wishlist
                    </Link>
                    <Link to="/cart" style={linkStyle} className="hover-white" onClick={closeMenu}>
                        Cart
                    </Link>
                    <Link to="/orders" style={linkStyle} className="hover-white" onClick={closeMenu}>
                        Orders
                    </Link>
                    {role === "admin" && (
                        <>
                            <Link to="/admin/products" style={linkStyle} className="hover-white" onClick={closeMenu}>
                                Manage Products
                            </Link>
                            <Link to="/admin/orders" style={linkStyle} className="hover-white" onClick={closeMenu}>
                                Manage Orders
                            </Link>
                        </>
                    )}

                    <div className="navbar-divider" style={{ width: "1px", height: "24px", background: "#e2e8f0", margin: "0 8px" }} />

                    <div className="navbar-user-section">
                        {fullName && (
                            <span style={{
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                color: "#0f766e",
                                padding: "0 8px"
                            }}>
                                {fullName}
                            </span>
                        )}

                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={logout}
                            style={{ marginLeft: "4px" }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;