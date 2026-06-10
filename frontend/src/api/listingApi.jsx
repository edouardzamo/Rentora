// src/api/listingApi.jsx
import api from "./axios";

// Create listing
export const createListing = (data) => {
  return api.post("/listings/create-listings", data);
};

// Upload multiple images
export const uploadImages = (listingId, formData) => {
  return api.post(`/listings/${listingId}/upload-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Alias for uploadImages (optional, remove if not needed)
// If you need both names, use this instead:
// export { uploadImages as uploadImage };

// Get all listings
export const getListings = async (params = {}) => {
  const response = await api.get("/listings/", { params });
  if (response.data && response.data.listings) {
    return { ...response, data: response.data.listings };
  }
  return response;
};

// Get single listing
export const getListingById = (id) => {
  return api.get(`/listings/${id}`);
};

// Get listing images
export const getListingImages = (listingId) => {
  return api.get(`/listings/${listingId}/images`);
};

// Delete image
export const deleteImage = (imageId) => {
  return api.delete(`/listings/images/${imageId}`);
};

// Set cover image
export const setCoverImage = (imageId) => {
  return api.put(`/listings/images/${imageId}/cover`);
};

// Get my listings (landlord)
export const getMyListings = () => {
  return api.get("/listings/my-listings");
};

// Delete listing
export const deleteListing = (id) => {
  return api.delete(`/listings/${id}`);
};

// Update availability
export const updateAvailability = (id, isAvailable) => {
  return api.put(`/listings/${id}/availability`, null, {
    params: { is_available: isAvailable }
  });
};

// Rent listing
export const rentListing = (id) => {
  return api.put(`/listings/${id}/rent`);
};

// src/api/listingApi.jsx - Add this function
export const searchListings = (params) => {
  return api.get("/listings/search", { params });
};

// If you need both uploadImages and uploadImage, add this at the bottom:
// export const uploadImage = uploadImages;