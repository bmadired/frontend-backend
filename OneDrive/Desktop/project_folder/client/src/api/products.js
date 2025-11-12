import axios from "axios";

// Base Axios instance pointing to backend
const API = axios.create({
  baseURL: "http://localhost:25252/api", // backend base URL
});

// API functions for CRUD
export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
