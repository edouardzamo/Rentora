// src/components/ApiTest.jsx
import { useEffect, useState } from "react";
import { getListings } from "../api/listingApi";
import { getCurrentUser } from "../api/authApi";

export default function ApiTest() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApis = async () => {
      try {
        console.log("Testing API calls...");
        
        // Test public API
        const listingsRes = await getListings();
        console.log("Listings response:", listingsRes.data);
        setListings(listingsRes.data);
        
        // Test auth API (if logged in)
        const token = localStorage.getItem("access_token");
        if (token) {
          const userRes = await getCurrentUser();
          console.log("User response:", userRes.data);
          setUser(userRes.data);
        }
      } catch (err) {
        console.error("API test error:", err);
        setError(err.message);
      }
    };
    
    testApis();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Test Results</h2>
      {error && <div className="text-red-600">Error: {error}</div>}
      <div>
        <h3 className="font-semibold">Listings ({listings.length})</h3>
        <pre className="bg-gray-100 p-2 text-sm overflow-auto">
          {JSON.stringify(listings.slice(0, 2), null, 2)}
        </pre>
      </div>
      {user && (
        <div>
          <h3 className="font-semibold mt-4">Current User</h3>
          <pre className="bg-gray-100 p-2 text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}