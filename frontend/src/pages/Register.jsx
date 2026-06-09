// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to decode JWT token
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      console.log("Decoded token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Step 1: Register
      const payload = {
        username: name,
        phone_number: phoneNumber,
        password: password,
        role: role
      };

      console.log("Registering with:", payload);
      const response = await api.post("/auth/register", payload);
      console.log("Registration response:", response.data);

      if (response.status === 200 || response.status === 201) {
        // Step 2: Auto login after registration
        console.log("Auto-logging in...");
        const loginResponse = await api.post("/auth/login", {
          phone_number: phoneNumber,
          password: password
        });
        
        console.log("Login response:", loginResponse.data);
        const token = loginResponse.data.token;
        
        // Step 3: Get role from token
        const decodedToken = decodeToken(token);
        let userRole = role;
        userRole = userRole.toLowerCase(); // Use the role from form as fallback
        
        if (decodedToken && decodedToken.role) {
          userRole = decodedToken.role;
        } else if (decodedToken && decodedToken.user_role) {
          userRole = decodedToken.user_role;
        }
        
        console.log("User role detected:", userRole);
        
        // Step 4: Store token and role
        login(token);
        localStorage.setItem("user_role", userRole);
        
        alert(`Registration successful! Logged in as ${userRole}`);
        
        // Step 5: Navigate based on role
        if (userRole === "landlord") {
          console.log("Redirecting to DASHBOARD...");
          navigate("/dashboard");
        } else {
          console.log("Redirecting to LISTINGS...");
          navigate("/listings");
        }
      }
      
    } catch (error) {
      console.error("Registration error:", error);
      let message = "Registration failed";
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          message = detail.map((err) => err.msg || err.message).join("\n");
        } else if (typeof detail === "string") {
          message = detail;
        } else {
          message = JSON.stringify(detail);
        }
      } else if (error.message) {
        message = error.message;
      }
      
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-3 text-sm">
            {errorMessage}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded mb-3"
          required
        />

        <input
          type="tel"
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
          className="w-full border p-3 rounded mb-3"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 font-bold hover:underline ml-1"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;