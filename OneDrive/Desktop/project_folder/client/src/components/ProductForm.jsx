import React, { useState, useEffect } from "react";

const ProductForm = ({ onSubmit, existingProduct = null }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name || "",
        price: existingProduct.price || "",
        quantity: existingProduct.quantity || "",
      });
    }
  }, [existingProduct]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) {
      alert("⚠️ Please fill all fields");
      return;
    }

    onSubmit(form); // send data to parent (Home.jsx)
    setForm({ name: "", price: "", quantity: "" }); // reset form
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px",
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
          flex: "1",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
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
          flex: "1",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
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
          flex: "1",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        {existingProduct ? "✏️ Update Product" : "➕ Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
