import React from "react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="border rounded-xl shadow p-4 bg-white flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600">💲 {product.price}</p>
        <p className="text-gray-500">📦 {product.quantity} units</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
