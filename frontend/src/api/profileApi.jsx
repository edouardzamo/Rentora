// src/api/profileApi.jsx
import api from "./axios";

// Get user profile
export const getProfile = () => {
  return api.get("/auth/me");
};

// Update profile
export const updateProfile = (data) => {
  return api.put("/auth/me", data);
};

// Change password
export const changePassword = (oldPassword, newPassword) => {
  return api.put("/auth/change-password", {
    old_password: oldPassword,
    new_password: newPassword,
  });
};