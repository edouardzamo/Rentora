// src/api/axios.js
import axios from "axios";


const API_URL = import.meta.env.DEV ? "http://localhost:8000" : "https://rentora-fg8s.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    console.log("Token in interceptor:", token ? "Yes" : "No"); // Debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;