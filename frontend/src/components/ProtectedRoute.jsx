// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  console.log("ProtectedRoute - User role:", userRole);
  console.log("ProtectedRoute - Allowed roles:", allowedRoles);
  console.log("ProtectedRoute - Is authenticated:", isAuthenticated);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole.toLowerCase())) {
    console.log(`Role ${userRole} not allowed. Redirecting based on role...`);
    // Redirect based on actual role
    if (userRole.toLowerCase() === "landlord") {
      console.log("Redirecting landlord to /dashboard");
      return <Navigate to="/dashboard" replace />;
    } else {
      console.log("Redirecting tenant to /listings");
      return <Navigate to="/listings" replace />;
    }
  }

  console.log("Access granted to route");
  return children;
};

export default ProtectedRoute;