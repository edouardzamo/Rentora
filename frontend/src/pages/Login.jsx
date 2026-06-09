// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to decode JWT token
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        phone_number: phoneNumber,
        password: password
      });
      
      console.log("Login response:", response.data);
      
      const token = response.data.token;
      
      if (!token) {
        throw new Error("No token received");
      }
      
      // Decode token to get user role
      const decodedToken = decodeToken(token);
      console.log("Decoded token:", decodedToken);
      
      let userRole = "tenant"; // default
      
      // Check role from token
      if (decodedToken) {
        userRole = decodedToken.role || decodedToken.user_role || "tenant";
      }
      
      console.log("User role from token:", userRole);
      
      // Store token and role
      login(token);
      localStorage.setItem("user_role", userRole);
      
      alert("Login successful!");
      
      // Navigate based on role - LANDLORD GOES TO DASHBOARD
      if (userRole === "landlord") {
        console.log("Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        console.log("Redirecting to listings...");
        navigate("/listings");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full border p-3 rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 font-bold hover:underline ml-1"
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;