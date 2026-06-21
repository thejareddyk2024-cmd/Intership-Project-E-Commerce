import { useEffect, useState } from "react";
import api from "../services/api";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/v1/admin/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Sort by latest orders first (assuming id is auto-incrementing or created_at)
            const sortedOrders = response.data.sort((a, b) => b.id - a.id);
            setOrders(sortedOrders);
        } catch (error) {
            console.log(error);
            alert("Failed to fetch orders.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/api/v1/admin/orders/${orderId}/status`,
                null,
                {
                    params: { status: newStatus },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert("Order status updated successfully!");
            // Refresh orders after update
            fetchOrders();
        } catch (error) {
            console.log(error);
            alert("Failed to update order status.");
        }
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "delivered":
                return { background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
            case "processing":
            case "on the way":
            case "shipped":
                return { background: "#fffbeb", color: "#a16207", border: "1px solid #fde68a" };
            case "cancelled":
                return { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
            case "pending":
            default:
                return { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" };
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
                <p style={{ color: "#64748b" }}>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="page-wrapper" style={{ background: "#f8fafc", minHeight: "80vh" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                        Manage <span className="gradient-text">Orders</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.9375rem", margin: 0 }}>
                        View and update all customer orders.
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
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📋</div>
                        <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No orders found</h3>
                        <p style={{ color: "#64748b" }}>There are currently no orders in the system.</p>
                    </div>
                ) : (
                    <div style={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        overflow: "hidden"
                    }}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", color: "#64748b", fontWeight: 600 }}>Order ID</th>
                                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", color: "#64748b", fontWeight: 600 }}>User ID</th>
                                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", color: "#64748b", fontWeight: 600 }}>Date</th>
                                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", color: "#64748b", fontWeight: 600 }}>Total Amount</th>
                                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", color: "#64748b", fontWeight: 600 }}>Status</th>
                                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", color: "#64748b", fontWeight: 600 }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                            <td style={{ padding: "1rem", fontSize: "0.9375rem", fontWeight: 600 }}>#{order.id}</td>
                                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#475569" }}>User {order.user_id}</td>
                                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#475569" }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td style={{ padding: "1rem", fontSize: "0.9375rem", fontWeight: 700, color: "#0f766e" }}>${order.total_amount}</td>
                                            <td style={{ padding: "1rem" }}>
                                                <span style={{
                                                    ...getStatusStyle(order.status),
                                                    padding: "4px 12px",
                                                    borderRadius: "20px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 700,
                                                    textTransform: "uppercase"
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "1rem" }}>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    style={{ width: "140px", fontSize: "0.8125rem", padding: "4px 8px" }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="on the way">On the way</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminOrders;
