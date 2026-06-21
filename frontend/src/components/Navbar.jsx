import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const fullName = localStorage.getItem("full_name");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("full_name");
        navigate("/");
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
                width: "100%"
            }}>
                <Link
                    to="/products"
                    style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                    <span className="gradient-text" style={{ fontSize: "1.35rem", fontWeight: 800 }}>
                        ShopSmart-AI
                    </span>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    {role === "admin" && (
                        <Link
                            to="/admin-dashboard"
                            style={{
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: "#475569",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                transition: "all 0.2s"
                            }}
                            className="hover-white"
                        >
                            Dashboard
                        </Link>
                    )}
                    <Link
                        to="/products"
                        style={{
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#475569",
                            padding: "8px 16px",
                            borderRadius: "8px"
                        }}
                        className="hover-white"
                    >
                        Products
                    </Link>
                    <Link
                        to="/wishlist"
                        style={{
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#475569",
                            padding: "8px 16px",
                            borderRadius: "8px"
                        }}
                        className="hover-white"
                    >
                        Wishlist
                    </Link>
                    <Link
                        to="/cart"
                        style={{
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#475569",
                            padding: "8px 16px",
                            borderRadius: "8px"
                        }}
                        className="hover-white"
                    >
                        Cart
                    </Link>
                    <Link
                        to="/orders"
                        style={{
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#475569",
                            padding: "8px 16px",
                            borderRadius: "8px"
                        }}
                        className="hover-white"
                    >
                        Orders
                    </Link>
                    {role === "admin" && (
                        <>
                            <Link
                                to="/admin/products"
                                style={{
                                    textDecoration: "none",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    color: "#475569",
                                    padding: "8px 16px",
                                    borderRadius: "8px"
                                }}
                                className="hover-white"
                            >
                                Manage Products
                            </Link>
                            <Link
                                to="/admin/orders"
                                style={{
                                    textDecoration: "none",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    color: "#475569",
                                    padding: "8px 16px",
                                    borderRadius: "8px"
                                }}
                                className="hover-white"
                            >
                                Manage Orders
                            </Link>
                        </>
                    )}

                    <div style={{ width: "1px", height: "24px", background: "#e2e8f0", margin: "0 8px" }} />

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
            </nav>
        </header>
    );
}

export default Navbar;