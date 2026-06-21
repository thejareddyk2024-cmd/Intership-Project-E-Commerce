import { useEffect, useState } from "react";
import api from "../services/api";

function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/cart", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/api/v1/cart/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Item removed from cart");
            fetchCart();
        } catch (error) {
            console.log(error);
            alert("Failed to remove item");
        }
    };

    const checkout = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/api/v1/orders/checkout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Order placed successfully!");
            fetchCart();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Checkout failed");
        }
    };

    return (
        <div className="page-wrapper" style={{ background: "#f8fafc" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                        Shopping <span className="gradient-text">Cart</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.9375rem", margin: 0 }}>
                        Manage your selected items and proceed to checkout.
                    </p>
                </header>

                {cart.length === 0 ? (
                    <div style={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        textAlign: "center",
                        padding: "3rem 2rem"
                    }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛒</div>
                        <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Your cart is empty</h3>
                        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Looks like you haven't added anything yet.</p>
                        <a href="/products" className="btn btn-primary">Explore Products</a>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
                        {/* Cart Items */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {cart.map((item) => (
                                <div key={item.id} style={{
                                    background: "white",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "14px",
                                    padding: "1.25rem 1.5rem",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    transition: "box-shadow 0.2s"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "10px",
                                            background: "#f0fdfa",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            color: "#0f766e",
                                            fontSize: "0.875rem"
                                        }}>
                                            #{item.product_id}
                                        </div>
                                        <div>
                                            <h5 style={{ fontSize: "0.9375rem", fontWeight: 600, margin: "0 0 0.25rem" }}>
                                                Product #{item.product_id}
                                            </h5>
                                            <span style={{ color: "#64748b", fontSize: "0.8125rem" }}>
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#dc2626",
                                            fontSize: "0.8125rem",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            padding: "4px 8px"
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div style={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            position: "sticky",
                            top: "80px"
                        }}>
                            <h4 style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "1.0625rem" }}>Order Summary</h4>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Items</span>
                                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{cart.length}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Shipping</span>
                                <span style={{ color: "#059669", fontWeight: 600, fontSize: "0.875rem" }}>FREE</span>
                            </div>
                            <hr style={{ borderColor: "#e2e8f0", margin: "1rem 0" }} />
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                                <span style={{ fontWeight: 700 }}>Total</span>
                                <span className="gradient-text" style={{ fontWeight: 800 }}>Ready</span>
                            </div>
                            <button
                                className="btn btn-primary btn-lg"
                                style={{ width: "100%" }}
                                onClick={checkout}
                            >
                                Proceed to Checkout
                            </button>
                            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.75rem", marginTop: "1rem", marginBottom: 0 }}>
                                Secure checkout powered by ShopSmart-AI
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;