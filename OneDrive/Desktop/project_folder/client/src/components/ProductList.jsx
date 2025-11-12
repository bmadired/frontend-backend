import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, onEdit, onDelete }) => {
  // if no products exist
  if (!products || products.length === 0) {
    return <p style={{ color: "#888" }}>No products found. Add one above!</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "15px",
        marginTop: "10px",
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductList;
