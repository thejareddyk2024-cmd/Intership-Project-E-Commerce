import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem(
                "token"
            );

            const response = await api.get(
                "/api/v1/orders",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'text-success border-success bg-success bg-opacity-10';
            case 'pending': return 'text-warning border-warning bg-warning bg-opacity-10';
            default: return 'text-info border-info bg-info bg-opacity-10';
        }
    }

    return (
        <div className="container py-5 page-wrapper">
            <header className="mb-5">
                <h1 className="fw-800 display-5 mb-0">Order <span className="gradient-text">History</span></h1>
                <p className="text-white-50 mt-2">Track and manage your past acquisitions.</p>
            </header>

            {orders.length === 0 ? (
                <div className="glass-card text-center py-5">
                    <div className="mb-4">
                        <span className="fs-1">📦</span>
                    </div>
                    <h3 className="text-white">No orders yet</h3>
                    <p className="text-white-50">Your order history will appear here once you make a purchase.</p>
                    <a href="/products" className="btn btn-primary mt-3 px-5">Start Shopping</a>
                </div>
            ) : (
                <div className="row">
                    <div className="col-12">
                        {orders.map((order) => (
                            <div key={order.id} className="glass-card mb-4 p-4 border-0">
                                <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-glass rounded-3 p-3 me-4 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.05)" }}>
                                            <span className="gradient-text fw-800">#{order.id.toString().slice(-4)}</span>
                                        </div>
                                        <div>
                                            <h5 className="mb-1 text-white fw-700">Order ID: {order.id}</h5>
                                            <p className="text-white-50 mb-0 small">Placed on: {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="text-end">
                                            <div className="small text-white-50 mb-1">Total Amount</div>
                                            <div className="h4 mb-0 gradient-text fw-800">${order.total_amount}</div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-pill border small fw-700 ${getStatusColor(order.status)}`}>
                                            {order.status.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-secondary my-4 opacity-25" />
                                <div className="d-flex justify-content-between align-items-center text-white-50 small">
                                    <div>
                                        <span className="me-3">Shipping: <span className="text-white">Express Delivery</span></span>
                                        <span>Items: <span className="text-white">3 Units</span></span>
                                    </div>
                                    <button className="btn btn-link text-white-50 text-decoration-none small p-0 hover-white">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;