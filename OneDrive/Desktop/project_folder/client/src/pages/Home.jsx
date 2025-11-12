import React, { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/products";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct._id, formData);
        setEditingProduct(null);
      } else {
        // Create new product
        await createProduct(formData);
      }
      fetchProducts(); // Refresh the list
    } catch (err) {
      setError("Failed to save product. Please try again.");
      console.error(err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        fetchProducts(); // Refresh the list
      } catch (err) {
        setError("Failed to delete product. Please try again.");
        console.error(err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>📦 Product Management</h1>

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
        <h2 style={{ marginTop: 0 }}>
          {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>
        <ProductForm onSubmit={handleAddProduct} existingProduct={editingProduct} />
        {editingProduct && (
          <button
            onClick={handleCancelEdit}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 15px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            ❌ Cancel Edit
          </button>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>📋 Products List</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
