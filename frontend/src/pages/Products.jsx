import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get(
                "/api/v1/products"
            );

            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const addToWishlist = async (productId) => {
        try {
            const token = localStorage.getItem(
                "token"
            );

            await api.post(
                "/api/v1/wishlist",
                {
                    product_id: productId
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Added to wishlist!"
            );
        } catch (error) {
            console.log(error);
            alert(
                "Failed to add to wishlist"
            );
        }
    };
    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem(
                "token"
            );

            await api.post(
                "/api/v1/cart",
                {
                    product_id: productId,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Added to cart!"
            );
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.detail ||
                "Failed to add to cart"
            );
        }
    };

    return (
        <div className="container py-5 page-wrapper">
            <header className="mb-5 text-center">
                <h1 className="fw-800 display-4 mb-3">
                    Discover <span className="gradient-text">Premium</span> Tech
                </h1>
                <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "600px" }}>
                    Explore our curated collection of AI-powered gadgets and future-ready hardware.
                </p>
                <div className="mt-4">
                    <span className="badge bg-primary px-4 py-2 fs-6">
                        {products.length} Products Available
                    </span>
                </div>
            </header>

            <div className="row g-4 product-grid">
                {products.map((product) => (
                    <div key={product.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div className="glass-card h-100 overflow-hidden product-card">
                            <div className="card-body d-flex flex-column p-4">
                                <div className="mb-3 d-flex justify-content-between align-items-start">
                                    <h5 className="fw-700 mb-0 text-white flex-grow-1 me-2">{product.name}</h5>
                                    <span className="gradient-text fw-800 fs-5">${product.price}</span>
                                </div>
                                <p className="text-white-50 small flex-grow-1 mb-4" style={{ minHeight: "60px" }}>
                                    {product.description}
                                </p>
                                <div className="mt-auto">
                                    <div className="d-flex align-items-center mb-4 text-white-50 small">
                                        <i className="bi bi-box-seam me-2"></i>
                                        <span>Stock: {product.stock_quantity} units</span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-primary flex-grow-1"
                                            onClick={() => addToCart(product.id)}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="btn btn-outline-primary p-2 d-flex align-items-center justify-content-center"
                                            style={{ width: "45px" }}
                                            onClick={() => addToWishlist(product.id)}
                                            title="Add to wishlist"
                                        >
                                            ❤
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;