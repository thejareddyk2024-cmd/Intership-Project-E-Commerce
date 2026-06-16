import { useEffect, useState } from "react";
import api from "../services/api";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem(
                "token"
            );

            const response = await api.get(
                "/api/v1/wishlist",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setWishlist(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container py-5 page-wrapper">
            <header className="mb-5">
                <h1 className="fw-800 display-5 mb-0">Saved <span className="gradient-text">Favorites</span></h1>
                <p className="text-white-50 mt-2">Your personal collection of future tech.</p>
            </header>

            {wishlist.length === 0 ? (
                <div className="glass-card text-center py-5">
                    <div className="mb-4">
                        <span className="fs-1">✨</span>
                    </div>
                    <h3 className="text-white">Your wishlist is waiting</h3>
                    <p className="text-white-50">Save items you love to find them later.</p>
                    <a href="/products" className="btn btn-primary mt-3 px-5">Browse Catalog</a>
                </div>
            ) : (
                <div className="row g-4">
                    {wishlist.map((item) => (
                        <div key={item.id} className="col-12 col-md-6 col-lg-4">
                            <div className="glass-card h-100 overflow-hidden product-card">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="bg-glass rounded-3 p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.05)" }}>
                                            <span className="gradient-text fw-800">#{item.product_id}</span>
                                        </div>
                                        <div>
                                            <h5 className="mb-0 text-white fw-700">Premium Tech Item</h5>
                                            <p className="text-white-50 small mb-0 flex-grow-1">SKU: SS-{item.product_id}00X</p>
                                        </div>
                                    </div>
                                    <p className="text-white-50 small mb-4">
                                        Added to your wishlist. This high-performance device is ready for your next project.
                                    </p>
                                    <div className="d-grid mt-4">
                                        <a href="/products" className="btn btn-outline-primary">View in Store</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;