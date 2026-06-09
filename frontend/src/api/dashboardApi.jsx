// src/api/dashboardApi.jsx
import api from "./axios";

// Get dashboard statistics
export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};

// Get recent activity
export const getRecentActivity = () => {
  return api.get("/dashboard/recent-activity");
};