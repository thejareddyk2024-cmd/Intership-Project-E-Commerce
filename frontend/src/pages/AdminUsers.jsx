import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(
                "/api/v1/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const promote = async (userId) => {
        try {

            const token =
                localStorage.getItem("token");

            await api.put(
                `/api/v1/admin/promote/${userId}`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert("User promoted to Admin");

            fetchUsers();

        } catch (error) {

            alert(
                error.response?.data?.detail ||
                "Failed to promote user"
            );

        }
    };

    const demote = async (userId) => {
        try {

            const token =
                localStorage.getItem("token");

            await api.put(
                `/api/v1/admin/demote/${userId}`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "User demoted to Customer"
            );

            fetchUsers();

        } catch (error) {

            alert(
                error.response?.data?.detail ||
                "Failed to demote user"
            );

        }
    };

    const getRoleBadgeStyle = (role) => {
        if (role === "admin") {
            return { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
        }
        return { background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
    };

    return (
        <div className="page-wrapper" style={{ background: "#f8fafc" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 0 }}>
                        User <span className="gradient-text">Management</span>
                    </h1>
                    <Link to="/admin/products" className="btn btn-outline-primary">
                        Manage Products
                    </Link>
                </header>

                <div className="admin-table-wrapper">
                    <div className="admin-table-scroll">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: 600 }}>{user.full_name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span style={{
                                                ...getRoleBadgeStyle(user.role),
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "0.75rem",
                                                fontWeight: 700,
                                                textTransform: "uppercase"
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            {user.role === "customer" ? (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => promote(user.id)}
                                                >
                                                    Promote to Admin
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => demote(user.id)}
                                                >
                                                    Demote to Customer
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;
