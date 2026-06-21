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
            <div className="container mt-5">
                Loading...
            </div>
        );

    }

    return (
        <div className="container py-5">

            <h1 className="mb-5 fw-bold">
                📊 Admin Dashboard
            </h1>

            <div className="row g-4">

                <div className="col-md-3">
                    <div className="card p-4 text-center h-100 shadow">
                        <h2>📦</h2>
                        <h3>{stats.total_products}</h3>
                        <p className="mb-0">
                            Products
                        </p>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-4 text-center h-100 shadow">
                        <h2>👥</h2>
                        <h3>{stats.total_users}</h3>
                        <p className="mb-0">
                            Users
                        </p>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-4 text-center h-100 shadow">
                        <h2>🛒</h2>
                        <h3>{stats.total_orders}</h3>
                        <p className="mb-0">
                            Orders
                        </p>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-4 text-center h-100 shadow">
                        <h2>💰</h2>
                        <h3>
                            ${stats.total_revenue}
                        </h3>
                        <p className="mb-0">
                            Revenue
                        </p>
                    </div>
                </div>

            </div>

            <div className="row g-4 mt-3">

                <div className="col-md-6">

                    <div className="card p-4 h-100 shadow">

                        <h3 className="mb-3">
                            ⭐ Top Rated Product
                        </h3>

                        <h4>
                            {stats.top_rated_product}
                        </h4>

                        <p className="text-muted mb-0">
                            Average Rating:
                            {" "}
                            {stats.top_rated_score}
                            {" "}
                            ⭐
                        </p>

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card p-4 h-100 shadow">

                        <h3 className="mb-3">
                            ❤️ Most Wishlisted Product
                        </h3>

                        <h4>
                            {stats.most_wishlisted_product}
                        </h4>

                        <p className="text-muted mb-0">
                            Wishlisted
                            {" "}
                            {stats.wishlist_count}
                            {" "}
                            times
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;