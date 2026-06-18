import { useEffect, useState } from "react";
import api from "../services/api";

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
        <div className="container mt-4">
            <h1>Admin Product Management</h1>
            <form
                onSubmit={
                    editingId
                        ? updateProduct
                        : createProduct
                }
                className="card p-4 mt-4 mb-4"
            >
                <h3>
                    {editingId
                        ? "Edit Product"
                        : "Create Product"}
                </h3>

                <input
                    className="form-control mb-2"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Price"
                    type="number"
                    value={price}
                    onChange={(e) =>
                        setPrice(e.target.value)
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Stock Quantity"
                    type="number"
                    value={stockQuantity}
                    onChange={(e) =>
                        setStockQuantity(
                            e.target.value
                        )
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) =>
                        setImageUrl(e.target.value)
                    }
                />

                <input
                    className="form-control mb-3"
                    placeholder="Category ID"
                    type="number"
                    value={categoryId}
                    onChange={(e) =>
                        setCategoryId(
                            e.target.value
                        )
                    }
                />

                <button
                    type="submit"
                    className="btn btn-success"
                >
                    {
                        editingId
                            ? "Update Product"
                            : "Create Product"
                    }
                </button>
            </form>
                        <table className="table table-striped mt-4">
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
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.stock_quantity}</td>

                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProducts;