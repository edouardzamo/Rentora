// src/api/notificationApi.jsx
import api from "./axios";

// Get my notifications
export const getNotifications = () => {
  return api.get("/notifications");
};

// Mark notification as read
export const markAsRead = (notificationId) => {
  return api.put(`/notifications/${notificationId}/read`);
};

// Mark all as read
export const markAllAsRead = () => {
  return api.put("/notifications/read-all");
};

// Delete notification
export const deleteNotification = (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};