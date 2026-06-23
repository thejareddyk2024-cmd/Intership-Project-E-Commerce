import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [editingId, setEditingId] = useState(null);

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
    const deleteProduct = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await api.delete(
                `/api/v1/products/${productId}`
            );

            alert("Product deleted");

            fetchProducts();
        } catch (error) {
            console.log(error);

            alert(
                "Failed to delete product"
            );
        }
    };
    const startEdit = (product) => {
        setEditingId(product.id);

        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setStockQuantity(
            product.stock_quantity
        );
        setImageUrl(product.image_url);
        setCategoryId(
            product.category_id
        );
    };
    const createProduct = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                "/api/v1/products",
                {
                    name,
                    description,
                    price: parseFloat(price),
                    stock_quantity: parseInt(
                        stockQuantity
                    ),
                    image_url: imageUrl,
                    category_id: parseInt(
                        categoryId
                    )
                }
            );

            alert(
                "Product created successfully"
            );

            setName("");
            setDescription("");
            setPrice("");
            setStockQuantity("");
            setImageUrl("");
            setCategoryId("");

            fetchProducts();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to create product"
            );
        }
    };
    const updateProduct = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                `/api/v1/products/${editingId}`,
                {
                    name,
                    description,
                    price: parseFloat(price),
                    stock_quantity: parseInt(
                        stockQuantity
                    ),
                    image_url: imageUrl,
                    category_id: parseInt(
                        categoryId
                    )
                }
            );

            alert(
                "Product updated successfully"
            );

            setEditingId(null);

            setName("");
            setDescription("");
            setPrice("");
            setStockQuantity("");
            setImageUrl("");
            setCategoryId("");

            fetchProducts();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to update product"
            );
        }
    };

    return (
        <div className="page-wrapper" style={{ background: "#f8fafc" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 0 }}>
                        Product <span className="gradient-text">Management</span>
                    </h1>
                    <Link to="/admin/users" className="btn btn-outline-primary">
                        Manage Users
                    </Link>
                </header>

                {/* Product Form */}
                <form
                    onSubmit={
                        editingId
                            ? updateProduct
                            : createProduct
                    }
                    className="admin-form-card"
                    style={{ marginBottom: "1.5rem" }}
                >
                    <h3 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "1.0625rem" }}>
                        {editingId
                            ? "Edit Product"
                            : "Create Product"}
                    </h3>

                    <div className="admin-form-grid">
                        <div>
                            <label className="form-label">Name</label>
                            <input
                                className="form-control"
                                placeholder="Product name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="form-label">Description</label>
                            <input
                                className="form-control"
                                placeholder="Product description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="form-label">Price</label>
                            <input
                                className="form-control"
                                placeholder="$0.00"
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="form-label">Stock Quantity</label>
                            <input
                                className="form-control"
                                placeholder="0"
                                type="number"
                                value={stockQuantity}
                                onChange={(e) =>
                                    setStockQuantity(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div>
                            <label className="form-label">Image URL</label>
                            <input
                                className="form-control"
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={(e) =>
                                    setImageUrl(e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="form-label">Category ID</label>
                            <input
                                className="form-control"
                                placeholder="1"
                                type="number"
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: "1rem" }}
                    >
                        {
                            editingId
                                ? "Update Product"
                                : "Create Product"
                        }
                    </button>
                </form>

                {/* Products Table */}
                <div className="admin-table-wrapper">
                    <div className="admin-table-scroll">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td style={{ fontWeight: 600 }}>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td style={{ fontWeight: 600, color: "#0f766e" }}>${product.price}</td>
                                        <td>{product.stock_quantity}</td>

                                        <td>
                                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        startEdit(product)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        deleteProduct(product.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProducts;