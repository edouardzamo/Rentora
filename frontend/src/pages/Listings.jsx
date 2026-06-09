// src/pages/Listings.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings } from "../api/listingApi";
import ListingCard from "../components/ListingCard";
import FilterSidebar from "../components/FilterSidebar";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getListings();
      console.log("Listings response:", response.data); // Debug log
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to load listings. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchListings}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Properties</h1>

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
          <FilterSidebar onSearch={() => {}} />
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading properties...</div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties found.</p>
              <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
                Back to Home
              </Link>
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