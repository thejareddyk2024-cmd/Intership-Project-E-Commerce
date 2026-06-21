import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return { background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
            case "pending":
                return { background: "#fffbeb", color: "#a16207", border: "1px solid #fde68a" };
            default:
                return { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" };
        }
    };

    return (
        <div className="page-wrapper" style={{ background: "#f8fafc" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                        Order <span className="gradient-text">History</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.9375rem", margin: 0 }}>
                        Track and manage your past purchases.
                    </p>
                </header>

                {orders.length === 0 ? (
                    <div style={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        textAlign: "center",
                        padding: "3rem 2rem"
                    }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📦</div>
                        <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No orders yet</h3>
                        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Your order history will appear here once you make a purchase.</p>
                        <a href="/products" className="btn btn-primary">Start Shopping</a>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {orders.map((order) => (
                            <div key={order.id} style={{
                                background: "white",
                                border: "1px solid #e2e8f0",
                                borderRadius: "14px",
                                padding: "1.5rem"
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "1rem",
                                    marginBottom: "1rem"
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
                                            fontWeight: 800,
                                            color: "#0f766e",
                                            fontSize: "0.8125rem"
                                        }}>
                                            #{String(order.id).slice(-4)}
                                        </div>
                                        <div>
                                            <h5 style={{ fontSize: "0.9375rem", fontWeight: 700, margin: "0 0 0.25rem" }}>
                                                Order #{order.id}
                                            </h5>
                                            <p style={{ color: "#94a3b8", fontSize: "0.8125rem", margin: 0 }}>
                                                Placed on {new Date().toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Total</div>
                                            <div className="price-tag" style={{ fontSize: "1.25rem" }}>${order.total_amount}</div>
                                        </div>
                                        <span style={{
                                            ...getStatusStyle(order.status),
                                            padding: "6px 16px",
                                            borderRadius: "20px",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            textTransform: "uppercase"
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <hr style={{ borderColor: "#f1f5f9", margin: "0 0 0.75rem" }} />

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontSize: "0.8125rem",
                                    color: "#94a3b8"
                                }}>
                                    <div>
                                        <span style={{ marginRight: "1rem" }}>
                                            Shipping: <span style={{ color: "#0f172a", fontWeight: 500 }}>Express Delivery</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;