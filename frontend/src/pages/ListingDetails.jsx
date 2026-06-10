// src/pages/ListingDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getListingById } from '../api/listingApi';
import { addToFavorites, removeFromFavorites, checkFavoriteStatus } from '../api/FavoriteApi';
import { startConversation } from '../api/messageApi';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchListing();
    if (isAuthenticated) {
      checkFavorite();
    }
  }, [id, isAuthenticated]);

  const fetchListing = async () => {
    try {
      const response = await getListingById(id);
      console.log("Listing data:", response.data); // Debug log
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await checkFavoriteStatus(id);
      setIsFavorited(response.data.is_favorited);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleFavorite = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      try {
        if (isFavorited) {
          await removeFromFavorites(listing.id);
          setIsFavorited(false);
          alert('Removed from favorites');
        } else {
          await addToFavorites(listing.id);
          setIsFavorited(true);
          alert('Added to favorites');
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Failed to update favorites');
      }
    };

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowMessageForm(true);
  };

  const handleSendMessage = async () => {
      if (!message.trim()) return;
      setSending(true);
      
      console.log("Sending message for listing ID:", id);
      console.log("Message content:", message);
      console.log("Auth token exists:", !!localStorage.getItem("access_token"));
      
      try {
        const response = await startConversation(id, message);
        console.log("Message sent successfully:", response.data);
        alert('Message sent to owner!');
        setMessage('');
        setShowMessageForm(false);
        navigate('/messages');
      } catch (error) {
        console.error("Error sending message:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);
        alert(`Failed to send message: ${error.response?.data?.detail || error.message}`);
      } finally {
        setSending(false);
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading property details...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Property Not Found</h2>
        <p className="text-gray-500 mt-2">The property you're looking for doesn't exist.</p>
        <Link to="/listings" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Browse Properties
        </Link>
      </div>
    );
  }

  // FIX: Handle images as objects with image_url property
  const getImageUrl = (image) => {
    if (typeof image === 'string') return image;
    if (image && image.image_url) return image.image_url;
    return '/placeholder-house.jpg';
  };

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : [{ image_url: '/placeholder-house.jpg' }];

  return (
    <div className="bg-white min-h-screen">
      {/* Header with navigation */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-blue-600">Listings</Link>
            <span>/</span>
            <span className="text-gray-800">{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={getImageUrl(images[selectedImage])}
                alt={listing.title}
                className="w-full h-[400px] object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-house.jpg';
                }}
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`Thumb ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-house.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Info */}
            <div className="mt-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{listing.title}</h1>
                  <p className="text-gray-500 mt-1 flex items-center gap-1">
                    📍 {listing.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {listing.price?.toLocaleString()} FRS/month
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {listing.description || 'No description provided.'}
              </p>
            </div>

            {/* Property Details Grid */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">🛏️</div>
                  <div className="font-semibold">{listing.bedrooms || 0} Bedrooms</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">🚿</div>
                  <div className="font-semibold">{listing.bathrooms || 0} Bathrooms</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">🏠</div>
                  <div className="font-semibold capitalize">{listing.property_type || 'N/A'}</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">📐</div>
                  <div className="font-semibold">{listing.area || 'N/A'} m²</div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Listed on:</span>
                  <span className="ml-2 text-gray-700">
                    {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Property ID:</span>
                  <span className="ml-2 text-gray-700">#{listing.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg shadow-sm p-6 sticky top-24">
              {/* Price */}
              <div className="border-b pb-4 mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  {listing.price?.toLocaleString()} FRS/month
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={handleFavorite}
                className="w-full mb-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <span>{isFavorited ? '❤️' : '🤍'}</span>
                {isFavorited ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>

              {/* Contact Owner Button */}
              {!showMessageForm ? (
                <button
                  onClick={handleContactOwner}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Contact Owner
                </button>
              ) : (
                <div className="mt-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello, I'm interested in your property. Can we schedule a visit?"
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSendMessage}
                      disabled={sending}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {sending ? 'Sending...' : 'Send Message'}
                    </button>
                    <button
                      onClick={() => setShowMessageForm(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div className="mt-6 pt-4 border-t text-xs text-gray-400">
                <p>✓ Verified Property</p>
                <p className="mt-1">✓ Direct contact with owner</p>
                <p className="mt-1">✓ No commission fees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;