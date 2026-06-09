// src/api/authApi.jsx
import api from "./axios";

// Register user
export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

// Login user
export const loginUser = (phoneNumber, password) => {
  return api.post("/auth/login", {
    phone_number: phoneNumber,
    password: password,
  });
};

// Get current user
export const getCurrentUser = () => {
  return api.get("/auth/me");
};

// Update profile
export const updateProfile = (userData) => {
  return api.put("/auth/me", userData);
};

// Change password
export const changePassword = (oldPassword, newPassword) => {
  return api.put("/auth/change-password", {
    old_password: oldPassword,
    new_password: newPassword,
  });
};

// Logout
export const logoutUser = () => {
  return api.post("/auth/logout");
};

// Refresh token
export const refreshToken = () => {
  return api.post("/auth/refresh");
};