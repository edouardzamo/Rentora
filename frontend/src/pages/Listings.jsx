// src/pages/Listings.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchListings } from '../api/listingApi';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Load listings on mount and when URL params change
  useEffect(() => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    fetchListings(params);
  }, [searchParams]);

  const fetchListings = async (filters) => {
    setLoading(true);
    try {
      const response = await searchListings(filters);
      // Handle both array and paginated response
      let listingsData = response.data;
      if (response.data && response.data.listings) {
        listingsData = response.data.listings;
      }
      setListings(listingsData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    // Update URL params
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params[key] = value;
      }
    });
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Property</h1>

      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full py-2 bg-gray-100 rounded-lg"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-80`}>
          <FilterSidebar onSearch={handleSearch} />
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties found.</p>
              <button 
                onClick={() => handleSearch({})}
                className="mt-2 text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">{listings.length} properties found</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;