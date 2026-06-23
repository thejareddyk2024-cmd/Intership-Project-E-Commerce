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
                full_name: name,
                email,
                password
            });
            alert("Registration Successful! Please login.");
            navigate("/");
        } catch (error) {
            console.log(error);
            const detail = error.response?.data?.detail;
            const message = Array.isArray(detail)
                ? detail.map(d => d.msg).join(", ")
                : detail || "Registration Failed";
            alert(message);
        }
    };

    return (
        <div className="auth-form-container page-wrapper" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "85vh",
            width: "100%",
            padding: "2rem"
        }}>
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
                        Create Account
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
                        Join the ShopSmart-AI community
                    </p>
                </div>

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                            placeholder="Create a strong password"
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
                        Get Started
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
                        Already have an account?{" "}
                        <a href="/" style={{ fontWeight: 700, textDecoration: "none" }}>
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;