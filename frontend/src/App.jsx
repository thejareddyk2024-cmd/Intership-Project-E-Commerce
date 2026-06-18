import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedAdminRoute>
                            <AdminProducts />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedAdminRoute>
                            <AdminUsers />
                        </ProtectedAdminRoute>
                    }
                />
            </Routes>
            
        </BrowserRouter>
    );
}

export default App;