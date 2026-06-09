// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyListings, deleteListing, updateAvailability } from '../api/listingApi';
import { getDashboardStats } from '../api/dashboardApi';

const Dashboard = () => {
  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({
    total_listings: 0,
    total_views: 0,
    total_messages: 0,
    active_listings: 0
  });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Redirect tenant to listings
  useEffect(() => {
    console.log("Dashboard - User role:", userRole);
    if (isAuthenticated && userRole === "tenant") {
      navigate("/listings");
    }
  }, [userRole, isAuthenticated, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [listingsRes, statsRes] = await Promise.all([
        getMyListings(),
        getDashboardStats().catch(() => ({ data: stats }))
      ]);
      setListings(listingsRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    setDeletingId(listingId);
    try {
      await deleteListing(listingId);
      setListings(listings.filter(l => l.id !== listingId));
      alert('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailability = async (listingId, currentStatus) => {
    try {
      await updateAvailability(listingId, !currentStatus);
      setListings(listings.map(l => 
        l.id === listingId ? { ...l, is_available: !currentStatus } : l
      ));
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
          <p className="text-gray-600">Manage your properties</p>
        </div>
        <Link
          to="/create-listing"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add New Property
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.total_listings}</div>
          <div className="text-gray-600">Total Listings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.active_listings}</div>
          <div className="text-gray-600">Active Listings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.total_views}</div>
          <div className="text-gray-600">Total Views</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{stats.total_messages}</div>
          <div className="text-gray-600">Messages</div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">My Properties</h2>
        </div>
        
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🏠</div>
            <p className="text-gray-500">You haven't listed any properties yet</p>
            <Link
              to="/create-listing"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{listing.title}</div>
                        <div className="text-sm text-gray-500">ID: #{listing.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {listing.price?.toLocaleString()} FRS/month
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {listing.location}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailability(listing.id, listing.is_available)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          listing.is_available 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {listing.is_available ? 'Available' : 'Rented'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/listings/${listing.id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </Link>
                        <Link
                          to={`/upload-images/${listing.id}`}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Add Images
                        </Link>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          disabled={deletingId === listing.id}
                          className="text-red-600 hover:underline text-sm"
                        >
                          {deletingId === listing.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;