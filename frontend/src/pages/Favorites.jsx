// src/pages/Favorites.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyFavorites, removeFromFavorites } from '../api/FavoriteApi';
import ListingCard from '../components/ListingCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await getMyFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (listingId) => {
    setRemovingId(listingId);
    try {
      await removeFromFavorites(listingId);
      setFavorites(favorites.filter(fav => fav.id !== listingId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading favorites...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">My Favorites</h1>
      <p className="text-gray-600 mb-6">Properties you've saved for later</p>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-4">Start saving properties you love!</p>
          <Link to="/listings" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((listing) => (
            <div key={listing.id} className="relative group">
              <ListingCard listing={listing} />
              <button
                onClick={() => handleRemove(listing.id)}
                disabled={removingId === listing.id}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
              >
                {removingId === listing.id ? '...' : '❤️'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;