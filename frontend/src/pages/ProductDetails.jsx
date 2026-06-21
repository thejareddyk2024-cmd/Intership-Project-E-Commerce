import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/api/v1/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/api/v1/reviews/${id}`);
            setReviews(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const submitReview = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/api/v1/reviews",
                { rating, comment, product_id: Number(id) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComment("");
            setRating(5);
            fetchReviews();
            alert("Review added!");
        } catch (error) {
            console.log(error);
            alert("Failed to add review");
        }
    };

    const addToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/api/v1/cart",
                { product_id: Number(id), quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Added to cart!");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.detail || "Failed to add to cart");
        }
    };

    const addToWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/api/v1/wishlist",
                { product_id: Number(id) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Added to wishlist!");
        } catch (error) {
            console.log(error);
            alert("Failed to add to wishlist");
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    if (!product) {
        return (
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
                <p style={{ color: "#64748b" }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="page-wrapper" style={{ background: "#f8fafc" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>

                {/* ── Product Main ────────────────────────────── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2.5rem",
                    marginBottom: "3rem"
                }}>
                    {/* Image */}
                    <div style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "white",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                    }}>
                        <img
                            src={product.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"}
                            alt={product.name}
                            style={{ width: "100%", height: "400px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Info */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                            {product.name}
                        </h1>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            <span style={{
                                background: "#fef3c7",
                                color: "#92400e",
                                padding: "4px 12px",
                                borderRadius: "6px",
                                fontWeight: 700,
                                fontSize: "0.875rem"
                            }}>
                                ⭐ {averageRating}
                            </span>
                            <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
                                ({reviews.length} Reviews)
                            </span>
                        </div>

                        <p className="price-tag" style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
                            ${product.price}
                        </p>

                        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.9375rem" }}>
                            {product.description}
                        </p>

                        <div style={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "1rem 1.25rem",
                            marginBottom: "1.5rem"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Stock</span>
                                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{product.stock_quantity} units</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Category ID</span>
                                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{product.category_id}</span>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={addToCart}>
                                Add to Cart
                            </button>
                            <button className="btn btn-outline-primary btn-lg" onClick={addToWishlist}>
                                ♥ Wishlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Reviews ────────────────────────────────── */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem" }}>
                        Customer Reviews
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="alert-info" style={{ padding: "1rem 1.25rem", borderRadius: "10px" }}>
                            No reviews yet. Be the first to review this product!
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    style={{
                                        background: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        padding: "1rem 1.25rem"
                                    }}
                                >
                                    <div style={{ marginBottom: "0.5rem", color: "#f59e0b" }}>
                                        {"⭐".repeat(review.rating)}
                                    </div>
                                    <p style={{ margin: "0 0 0.5rem", color: "#0f172a", fontSize: "0.9375rem" }}>
                                        {review.comment}
                                    </p>
                                    <small style={{ color: "#94a3b8" }}>
                                        User #{review.user_id}
                                    </small>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Write Review */}
                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem", marginTop: "1rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem" }}>
                            Write a Review
                        </h2>

                        <div style={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "14px",
                            padding: "1.5rem"
                        }}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label className="form-label">Rating</label>
                                <select
                                    className="form-control"
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                                    <option value={3}>⭐⭐⭐ (3)</option>
                                    <option value={2}>⭐⭐ (2)</option>
                                    <option value={1}>⭐ (1)</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label className="form-label">Comment</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience..."
                                    style={{ resize: "vertical" }}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={submitReview}>
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;