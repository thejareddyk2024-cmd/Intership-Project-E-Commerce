import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {

    const [stats, setStats] =
        useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {

        try {

            const response =
                await api.get(
                    "/api/v1/analytics/dashboard"
                );

            setStats(
                response.data
            );

        } catch (error) {

            console.log(error);

        }
    };

    if (!stats) {

        return (
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
                <p style={{ color: "#64748b" }}>Loading...</p>
            </div>
        );

    }

    return (
        <div className="page-wrapper" style={{ background: "#f8fafc" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>

                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                        📊 Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.9375rem", margin: 0 }}>
                        Overview of your store performance.
                    </p>
                </header>

                <div className="admin-stats-grid">
                    <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📦</div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>{stats.total_products}</h3>
                        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>Products</p>
                    </div>

                    <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>{stats.total_users}</h3>
                        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>Users</p>
                    </div>

                    <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛒</div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>{stats.total_orders}</h3>
                        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>Orders</p>
                    </div>

                    <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💰</div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>${stats.total_revenue}</h3>
                        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>Revenue</p>
                    </div>
                </div>

                <div className="admin-info-grid">
                    <div className="card" style={{ padding: "1.5rem" }}>
                        <h4 style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "1rem" }}>
                            ⭐ Top Rated Product
                        </h4>
                        <h5 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                            {stats.top_rated_product}
                        </h5>
                        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
                            Average Rating: {stats.top_rated_score} ⭐
                        </p>
                    </div>

                    <div className="card" style={{ padding: "1.5rem" }}>
                        <h4 style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "1rem" }}>
                            ❤️ Most Wishlisted Product
                        </h4>
                        <h5 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                            {stats.most_wishlisted_product}
                        </h5>
                        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
                            Wishlisted {stats.wishlist_count} times
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;