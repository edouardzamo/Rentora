// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [userRole, setUserRole] = useState(localStorage.getItem("user_role") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (newToken) => {
    console.log("Storing token:", newToken); // Debug
    setToken(newToken);
    localStorage.setItem("access_token", newToken);
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
  };

  const value = {
    token,
    userRole,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isLandlord: userRole === "landlord",
    isTenant: userRole === "tenant",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;