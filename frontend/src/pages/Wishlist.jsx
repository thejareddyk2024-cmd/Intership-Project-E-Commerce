import { useEffect, useState } from "react";
import api from "../services/api";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/wishlist", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const removeFromWishlist = async (wishlistId) => {
        const confirmed = window.confirm("Remove this item from wishlist?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/api/v1/wishlist/${wishlistId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Removed from wishlist");
            fetchWishlist();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Failed to remove item");
        }
    };

    return (
        <div className="page-wrapper" style={{ background: "#f8fafc" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                        Saved <span className="gradient-text">Favorites</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.9375rem", margin: 0 }}>
                        Your personal collection of favorite tech products.
                    </p>
                </header>

                {wishlist.length === 0 ? (
                    <div style={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        textAlign: "center",
                        padding: "3rem 2rem"
                    }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✨</div>
                        <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Your wishlist is waiting</h3>
                        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Save items you love to find them later.</p>
                        <a href="/products" className="btn btn-primary">Browse Products</a>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "1rem"
                    }}>
                        {wishlist.map((item) => (
                            <div key={item.id} style={{
                                background: "white",
                                border: "1px solid #e2e8f0",
                                borderRadius: "14px",
                                padding: "1.5rem",
                                transition: "box-shadow 0.3s, transform 0.3s",
                                display: "flex",
                                flexDirection: "column"
                            }}
                                className="product-card"
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flex: 1 }}>
                                    <div style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "10px",
                                        background: "#f8fafc",
                                        overflow: "hidden",
                                        flexShrink: 0
                                    }}>
                                        {item.product?.image_url ? (
                                            <img 
                                                src={item.product.image_url} 
                                                alt={item.product.name} 
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                            />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e2e8f0", color: "#64748b" }}>
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h5 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.25rem", color: "#0f172a" }}>
                                            {item.product?.name || `Product #${item.product_id}`}
                                        </h5>
                                        <p style={{ color: "#0f766e", fontWeight: 700, fontSize: "0.9375rem", margin: "0 0 0.25rem" }}>
                                            ${item.product?.price}
                                        </p>
                                        <p style={{ color: "#94a3b8", fontSize: "0.8125rem", margin: 0 }}>
                                            Added to favorites
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <a href={`/product/${item.product_id}`} className="btn btn-outline-primary" style={{ flex: 1, textDecoration: "none", textAlign: "center", fontSize: "0.8125rem" }}>
                                        View Product
                                    </a>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removeFromWishlist(item.id)}
                                        style={{ fontSize: "0.8125rem" }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;