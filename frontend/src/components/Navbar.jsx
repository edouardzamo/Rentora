// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Rentora
          </Link>

          {/* Desktop Navigation - Plain text, no i18n */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/listings" className="text-gray-700 hover:text-blue-600 transition">
              Listings
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => changeLanguage(currentLang === 'en' ? 'fr' : 'en')}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50"
              >
                {currentLang.toUpperCase()}
              </button>
            </div>

            {!isAuthenticated ? (
              <Link 
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                {userRole.toLowerCase() === 'landlord' && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                <Link to="/favorites" className="text-gray-700 hover:text-blue-600">
                  Favorites
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-blue-600">
                  Messages
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/listings" className="text-gray-700 hover:text-blue-600">Listings</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
              {!isAuthenticated ? (
                <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center">
                  Login
                </Link>
              ) : (
                <>
                  <button onClick={handleLogout} className="text-left text-red-600">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;