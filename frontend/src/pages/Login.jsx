import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/api/v1/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.access_token
            );
            localStorage.setItem(
                "role",
                response.data.role
            );
            localStorage.setItem(
                "full_name",
                response.data.full_name
            );

            alert("Login Successful!");
            navigate("/products");
        }catch (error) {
            console.log(error);

            alert(
            error.response?.data?.detail ||
                "Login Failed"
            );
        }
    };

    return (
        <div className="container auth-form-container page-wrapper">
            <div className="glass-card shadow-lg p-2" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-800 gradient-text mb-2">Welcome Back</h2>
                        <p className="text-muted">Enter your credentials to continue</p>
                    </div>
                    <form onSubmit={handleLogin}>
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
                                Sign In
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-5">
                        <p className="text-muted small">
                            Don't have an account? <a href="/register" className="gradient-text text-decoration-none fw-bold">Sign Up Free</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;