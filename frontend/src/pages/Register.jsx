import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/v1/auth/register", {
                name,
                email,
                password
            });
            alert("Registration Successful! Please login.");
            navigate("/");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Registration Failed");
        }
    };

    return (
        <div className="container auth-form-container page-wrapper">
            <div className="glass-card shadow-lg p-2" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-800 gradient-text mb-2">Create Account</h2>
                        <p className="text-muted">Join the ShopSmart-AI community</p>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 ms-1">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 ms-1">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 ms-1">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid gap-2 mt-5">
                            <button type="submit" className="btn btn-primary btn-lg">
                                Get Started
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-5">
                        <p className="text-muted small">
                            Already have an account? <a href="/" className="gradient-text text-decoration-none fw-bold">Sign In</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;