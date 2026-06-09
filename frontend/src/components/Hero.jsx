// src/components/Hero.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        minHeight: "600px"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          Find Your Perfect Home
        </h1>
        <p className="text-xl md:text-2xl mb-12">
          Discover apartments and houses across Cameroon
        </p>
        
        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 text-gray-900 rounded-lg md:rounded-l-lg md:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg md:rounded-r-lg md:rounded-l-none hover:bg-blue-700 transition text-lg font-semibold"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Hero;