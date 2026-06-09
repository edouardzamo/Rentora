// src/pages/UploadImages.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadImages, getListingById } from '../api/listingApi';

const UploadImages = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await getListingById(listingId);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    
    // Create preview URLs
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  // Upload images one by one
  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      
      try {
        await uploadImage(listingId, formData);
        successCount++;
        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error);
      }
    }

    setUploading(false);
    alert(`Successfully uploaded ${successCount} out of ${files.length} images`);
    
    if (successCount > 0) {
      navigate(`/listings/${listingId}`);
    }
  };

  // Remove a file from the queue
  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Upload Property Images</h1>
      
      {/* Listing Info */}
      {listing && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold">{listing.title}</h2>
          <p className="text-gray-600 text-sm">{listing.location}</p>
        </div>
      )}

      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Select Images
        </label>
        <p className="text-gray-500 text-sm mt-2">
          You can select multiple images at once
        </p>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Preview ({previews.length} images)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <button
          onClick={() => navigate(`/listings/${listingId}`)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Tips for good photos:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use bright, well-lit spaces</li>
          <li>• Take photos from corners to show full rooms</li>
          <li>• Include exterior shots of the property</li>
          <li>• Maximum file size: 10MB per image</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadImages;