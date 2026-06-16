import { useEffect, useState } from "react";
import api from "../services/api";

function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem(
                "token"
            );

            const response = await api.get(
                "/api/v1/cart",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setCart(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const removeFromCart = async (cartId) => {
        try {
            const token = localStorage.getItem(
                "token"
            );

            await api.delete(
                `/api/v1/cart/${cartId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Item removed from cart"
            );

            fetchCart();
        } catch (error) {
            console.log(error);

            alert(
                "Failed to remove item"
            );
        }
    };
    const checkout = async () => {
        try {
            const token = localStorage.getItem(
                "token"
            );

            await api.post(
                "/api/v1/orders/checkout",
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Order placed successfully!"
            );

            fetchCart();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Checkout failed"
            );
        }
    };

    return (
        <div className="container py-5 page-wrapper">
            <header className="mb-5">
                <h1 className="fw-800 display-5 mb-0">Shopping <span className="gradient-text">Cart</span></h1>
                <p className="text-white-50 mt-2">Manage your selected items and proceed to checkout.</p>
            </header>

            {cart.length === 0 ? (
                <div className="glass-card text-center py-5">
                    <div className="mb-4">
                        <span className="fs-1">🛒</span>
                    </div>
                    <h3 className="text-white">Your cart is empty</h3>
                    <p className="text-white-50">Looks like you haven't added anything yet.</p>
                    <a href="/products" className="btn btn-primary mt-3 px-5">Explore Products</a>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-8">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item border-0 mb-3 glass-card">
                                <div className="d-flex align-items-center flex-grow-1">
                                    <div className="bg-glass rounded-3 p-3 me-4 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.05)" }}>
                                        <span className="gradient-text fw-bold">#{item.product_id}</span>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1 text-white fw-600">Premium Product</h5>
                                        <div className="d-flex align-items-center">
                                            <span className="text-white-50 small me-3">Quantity: {item.quantity}</span>
                                            <span className="text-white-50 small">•</span>
                                            <span className="text-white-50 small ms-3">SKU: SS-{item.product_id}00X</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <button
                                        className="btn btn-link text-danger text-decoration-none small p-0 hover-opacity"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove Item
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-lg-4">
                        <div className="glass-card p-4">
                            <h4 className="fw-700 mb-4 text-white">Order Summary</h4>
                            <div className="d-flex justify-content-between mb-3 text-white-50">
                                <span>Subtotal</span>
                                <span>Calculated at next step</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-white-50">
                                <span>Shipping</span>
                                <span className="text-success">FREE</span>
                            </div>
                            <hr className="border-secondary my-4" />
                            <div className="d-flex justify-content-between mb-5">
                                <span className="h5 fw-700 text-white">Total</span>
                                <span className="h5 fw-700 gradient-text">Pending</span>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-primary btn-lg" onClick={checkout}>
                                    Proceed to Checkout
                                </button>
                            </div>
                            <p className="text-center text-white-50 small mt-4">
                                Secure checkout powered by ShopSmart-AI
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                .hover-opacity:hover {
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
}

export default Cart;