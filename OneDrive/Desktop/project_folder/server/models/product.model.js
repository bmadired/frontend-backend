const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    image: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
