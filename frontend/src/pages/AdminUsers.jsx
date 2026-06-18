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
            const response = await api.get("/api/v1/admin/users");
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const promote = async (userId) => {
        try {
            await api.put(`/api/v1/admin/promote/${userId}`);
            alert("User promoted to Admin");
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to promote user");
        }
    };

    const demote = async (userId) => {
        try {
            await api.put(`/api/v1/admin/demote/${userId}`);
            alert("User demoted to Customer");
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to demote user");
        }
    };

    return (
        <div className="container mt-4 page-wrapper">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="gradient-text fw-bold">User Management</h1>
                <Link to="/admin/products" className="btn btn-outline-primary rounded-pill">
                    Manage Products
                </Link>
            </div>

            <div className="glass-card p-4">
                <table className="table table-hover text-white">
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
                            <tr key={user.id} className="align-middle">
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge rounded-pill ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td>
                                    {user.role === "customer" ? (
                                        <button
                                            className="btn btn-success btn-sm rounded-pill px-3"
                                            onClick={() => promote(user.id)}
                                        >
                                            Promote to Admin
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-warning btn-sm rounded-pill px-3"
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
    );
}

export default AdminUsers;
