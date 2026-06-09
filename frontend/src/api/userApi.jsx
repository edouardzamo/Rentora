// src/api/userApi.jsx
import api from "./axios";

// Get user by ID
export const getUserById = (userId) => {
  return api.get(`/users/${userId}`);
};

// Get all users (admin only)
export const getAllUsers = () => {
  return api.get("/users");
};