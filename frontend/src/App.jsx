import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AIAssistant from "./pages/AIAssistant";
import AIWidget from "./components/AIWidget";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";

import { ThemeProvider } from "./components/ThemeProvider";

function App() {
    return (
        <ThemeProvider defaultTheme="system">
            <BrowserRouter>
                <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                    <Navbar />

                    <main className="flex-1">
                        <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                        <Route
                            path="/admin-dashboard"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminDashboard />
                                </ProtectedAdminRoute>
                            }
                        />
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
                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminOrders />
                                </ProtectedAdminRoute>
                            }
                        />
                        <Route
                            path="/product/:id"
                            element={<ProductDetails />}
                        />
                    </Routes>
                </main>

                <Footer />
                <AIWidget />
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;