require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = process.env.PORT || 25252;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend

// Connect Database
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('API is running successfully');
});

// Product routes
app.use('/api/products', productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
