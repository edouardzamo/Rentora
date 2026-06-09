import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profileApi";
import api from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        setProfile(response.data);
        setName(response.data.name);
        setFormData({
          name: response.data.name || "",
          phone_number: response.data.phone_number || ""
        });
      } catch (error) {
        console.log(error);
      }
    };
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await api.put("/auth/me", {
        name: name
      });
      setProfile(response.data);
      alert("Profile updated");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile(formData);
      setProfile(response.data);
      setEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  if (!profile) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      
      {/* MY PROFILE SECTION - PUT HERE */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">
          My Profile
        </h2>

        <label className="block mb-1 font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 rounded mb-4"
        />

        <p className="mb-2">
          <strong>Phone:</strong> {profile?.phone_number}
        </p>

        <p className="mb-4">
          <strong>Role:</strong> {profile?.role}
        </p>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>

      {/* ORIGINAL PROFILE SECTION */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">
          Profile Settings
        </h1>

        <div className="space-y-4">
          <input
            name="name"
            value={formData.name}
            disabled={!editing}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-3 rounded"
          />

          <input
            name="phone_number"
            value={formData.phone_number}
            disabled={!editing}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border p-3 rounded"
          />

          <div>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Role:</strong> {profile?.role}</p>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default Profile;