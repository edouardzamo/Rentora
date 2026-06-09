// src/components/FilterSidebar.jsx
import { useState } from 'react';

const FilterSidebar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    property_type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Filter out empty values
    const activeFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        activeFilters[key] = value;
      }
    });
    onSearch(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      property_type: ''
    });
    onSearch({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Filter</h3>
      
      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Enter location"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Min Price</label>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Any"
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Max Price</label>
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Any"
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Bedrooms */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Bedrooms</label>
        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Bathrooms</label>
        <select
          name="bathrooms"
          value={filters.bathrooms}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </div>

      {/* Property Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Property Type</label>
        <select
          name="property_type"
          value={filters.property_type}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Any</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="studio">Studio</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSearch}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;