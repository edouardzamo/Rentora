// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layout/MainLayout";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Listings from "../pages/Listings";
import ListingDetails from "../pages/ListingDetails";
import Dashboard from "../pages/Dashboard";
import CreateListing from "../pages/CreateListing";
import Favorites from "../pages/Favorites";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
import UploadImages from "../pages/UploadImages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="listings" element={<Listings />} />
        <Route path="listings/:id" element={<ListingDetails />} />
        
        {/* Tenant routes */}
        <Route path="favorites" element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } />
        
        {/* Landlord routes */}
        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="create-listing" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <CreateListing />
          </ProtectedRoute>
        } />
        <Route path="upload-images/:listingId" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <UploadImages />
          </ProtectedRoute>
        } />
        
        {/* Common routes (both roles) */}
        <Route path="messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;