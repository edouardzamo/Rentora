// src/components/AdvancedSearch.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    amenities: [],
    additionalNotes: ''
  });

  const propertyTypes = ['Apartment', 'House', 'Studio', 'Villa', 'Condo'];
  const amenitiesList = ['Parking', 'AC', 'Furnished', 'Pool', 'Garden', 'Security', 'Elevator'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setSearchParams(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Build query string
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value);
        }
      }
    });
    navigate(`/listings?${queryParams.toString()}`);
  };

  const handleReset = () => {
    setSearchParams({
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      amenities: [],
      additionalNotes: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSearch}>
        {/* Basic Search - Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleChange}
            placeholder="Enter city, neighborhood or address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price (XAF)
            </label>
            <input
              type="number"
              name="minPrice"
              value={searchParams.minPrice}
              onChange={handleChange}
              placeholder="Any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price (XAF)
            </label>
            <input
              type="number"
              name="maxPrice"
              value={searchParams.maxPrice}
              onChange={handleChange}
              placeholder="Any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Basic Filters - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              name="propertyType"
              value={searchParams.propertyType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {propertyTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <select
              name="bedrooms"
              value={searchParams.bedrooms}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <select
              name="bathrooms"
              value={searchParams.bathrooms}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {[1,2,3,4].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle Advanced Filters */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 text-sm mb-4 hover:underline"
        >
          {showAdvanced ? '− Fewer filters' : '+ More filters'}
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 mt-2">
            {/* Area Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Area (m²)
                </label>
                <input
                  type="number"
                  name="minArea"
                  value={searchParams.minArea}
                  onChange={handleChange}
                  placeholder="Any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Area (m²)
                </label>
                <input
                  type="number"
                  name="maxArea"
                  value={searchParams.maxArea}
                  onChange={handleChange}
                  placeholder="Any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              <div className="flex flex-wrap gap-3">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchParams.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="mr-2"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (optional)
              </label>
              <textarea
                name="additionalNotes"
                value={searchParams.additionalNotes}
                onChange={handleChange}
                placeholder="1-2 year rental, quiet area, etc."
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;