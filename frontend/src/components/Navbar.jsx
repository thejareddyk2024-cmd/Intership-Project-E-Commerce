import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("full_name");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top mt-3 mx-3 glass-card py-3">
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold gradient-text fs-3" to="/products">
                    ShopSmart-AI
                </Link>
                <button className="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link px-4 text-white-50 hover-white" to="/products">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-4 text-white-50 hover-white" to="/wishlist">Wishlist</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-4 text-white-50 hover-white" to="/cart">Cart</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-4 text-white-50 hover-white" to="/orders">Orders</Link>
                        </li>
                        {role === "admin" && (
                            <li className="nav-item">
                                <Link
                                    className="nav-link px-4 text-white-50 hover-white"
                                    to="/admin/products"
                                >
                                    Admin
                                </Link>
                            </li>
                        )}
                        <li className="nav-item ms-lg-3">
                            <button className="btn btn-outline-primary btn-sm rounded-pill px-4" onClick={logout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );  
}

export default Navbar;