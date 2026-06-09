// src/pages/CreateListing.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing, uploadImages } from '../api/listingApi';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    property_type: 'apartment'
  });

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploadProgress(0);
    
    try {
      // Step 1: Create the listing
      const submitData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        property_type: formData.property_type,
      };
      
      console.log("Creating listing:", submitData);
      const listingResponse = await createListing(submitData);
      const listingId = listingResponse.data.listing_id;
      console.log("Listing created with ID:", listingId);
      
      // Step 2: Upload multiple images
      if (selectedImages.length > 0) {
        console.log(`Uploading ${selectedImages.length} images...`);
        
        // Create FormData with all images
        const imageFormData = new FormData();
        selectedImages.forEach((image, index) => {
          imageFormData.append('files', image);
        });
        
        // Upload all images at once
        const uploadResponse = await uploadImages(listingId, imageFormData);
        console.log("Upload response:", uploadResponse.data);
        alert(`Successfully uploaded ${uploadResponse.data.images?.length || selectedImages.length} images!`);
      } else {
        alert('Listing created successfully without images!');
      }
      
      navigate(`/listings/${listingId}`);
      
    } catch (error) {
      console.error("Error creating listing:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.detail || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  // Remove a specific image from selection
  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Multiple Image Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <label className="block text-sm font-medium mb-2">Property Images (Multiple)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="w-full p-2 border rounded-lg"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">{imagePreviews.length} images selected</p>
              <div className="grid grid-cols-4 gap-2">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${idx + 1}`} 
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            You can select multiple images. All will be uploaded to the listing.
          </p>
        </div>
        
        {/* Rest of your form fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., Beautiful Apartment in Yaounde"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-lg"
            placeholder="Describe your property..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Price (FRS/month)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., 150000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., Yaounde, Mvog-Mbi"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Property Type</label>
          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="villa">Villa</option>
          </select>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;