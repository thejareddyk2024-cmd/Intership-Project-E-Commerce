import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" />;
    }

    if (role !== "admin") {
        return <Navigate to="/products" />;
    }

    return children;
}

export default ProtectedAdminRoute;
