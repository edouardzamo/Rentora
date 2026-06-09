// src/api/FavoriteApi.jsx
import api from "./axios";

// Add to favorites
export const addToFavorites = (listingId) => {
  return api.post(`/favorites/add/${listingId}`);
};

// Remove from favorites
export const removeFromFavorites = (favoriteId) => {
  return api.delete(`/favorites/${favoriteId}`);
};

// Get my favorites
export const getMyFavorites = () => {
  return api.get("/favorites/my-favorites");
};

// Check if listing is favorited
export const checkFavoriteStatus = (listingId) => {
  return api.get(`/favorites/check/${listingId}`);
};

// Alias for addToFavorites (for backward compatibility)
export const addFavorite = addToFavorites;