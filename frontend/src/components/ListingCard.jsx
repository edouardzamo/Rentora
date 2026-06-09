// src/components/ListingCard.jsx
import { Link } from "react-router-dom";

const ListingCard = ({ listing }) => {
  // Get cover image or first image from the images array
  let imageUrl = '/placeholder-house.jpg';
  
  if (listing.images && listing.images.length > 0) {
    const coverImage = listing.images.find(img => img.is_cover);
    imageUrl = coverImage ? coverImage.image_url : listing.images[0].image_url;
  }

  return (
    <Link to={`/listings/${listing.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-house.jpg';
            }}
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {listing.title}
            </h3>
            <span className="text-lg font-bold text-blue-600">
              {listing.price?.toLocaleString()} FRS
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-gray-500 text-sm mb-2">
            📍 {listing.location}
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>🛏️ {listing.bedrooms}</span>
            <span>🚿 {listing.bathrooms}</span>
            <span className="capitalize">🏠 {listing.property_type}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;