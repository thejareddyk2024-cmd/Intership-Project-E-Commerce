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
            const response = await api.post("/api/v1/auth/login", { email, password });
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("full_name", response.data.full_name);
            alert("Login Successful!");
            navigate("/products");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Login Failed");
        }
    };

    return (
        <div className="auth-form-container page-wrapper">
            <div style={{
                maxWidth: "420px",
                width: "100%",
                background: "white",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.04)",
                padding: "2.5rem"
            }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
                        Enter your credentials to continue
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: "100%", marginTop: "0.5rem" }}
                    >
                        Sign In
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
                        Don't have an account?{" "}
                        <a href="/register" style={{ fontWeight: 700, textDecoration: "none" }}>
                            Sign Up Free
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;