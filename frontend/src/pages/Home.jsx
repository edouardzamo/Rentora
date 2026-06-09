import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getListings } from "../api/listingApi";
import ListingCard from "../components/ListingCard";
import heroImage from "../assets/Hero.jpg"; // Add your hero image

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    houses: 10000,
    landlords: 5000,
    clients: 20000
  });

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await getListings({ limit: 6 });
      setFeaturedListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-xl md:text-1xl mb-8">
            Search from thousands of houses to rent and connect directly with landlords.
          </p>
          <Link 
            to="/listings"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
          >
            Search Houses
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.houses.toLocaleString()}+
              </div>
              <div className="text-gray-600">Houses</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.landlords.toLocaleString()}+
              </div>
              <div className="text-gray-600">Landlords</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.clients.toLocaleString()}+
              </div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;