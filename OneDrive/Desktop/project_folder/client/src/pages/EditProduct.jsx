import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProduct } from "../api/products";

const EditProduct = () => {
  const location = useLocation(); // receive product data from Home.jsx
  const navigate = useNavigate();

  // extract product data passed via navigate
  const product = location.state;

  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    quantity: product.quantity,
  });

  // handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle update form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(product._id, form)
      .then(() => {
        alert("✅ Product updated successfully!");
        navigate("/"); // go back to home
      })
      .catch((err) => console.error("Error updating product:", err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>✏️ Edit Product</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          💾 Save Changes
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#888",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          🔙 Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
