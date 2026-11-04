import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State mein profilePic: null add kiya hai
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "Male",
    lookingFor: "Female",
    bio: "",
    city: "",
    profilePic: null, 
  });

  const handleChange = (e) => {
    // Agar file input hai
    if (e.target.name === "profilePic") {
      setFormData({ ...formData, profilePic: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await registerUser(formData);

      if (data.userId) {
        setSuccess("Account ban gaya! Ab aap login kar sakte hain.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server se connect nahi ho paya. Backend chalu hai?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFAF5] p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Find your perfect match today</p>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center">{success}</div>}

        <form onSubmit={handleSignup} className="space-y-3">
          
          {/* Image Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" placeholder="Enter your name" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-800" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-800" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" placeholder="Min 6 characters" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-800" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input type="number" name="age" placeholder="e.g. 24" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-800" required />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">I am</label>
              <select name="gender" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-800">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Looking for</label>
              <select name="lookingFor" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-800">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Everyone">Everyone</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" name="city" placeholder="e.g. Mumbai" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-800" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
            <textarea name="bio" rows="2" placeholder="Tell us about yourself..." onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-800 resize-none"></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-800 text-white font-bold py-2.5 rounded-lg hover:bg-green-900 transition-colors mt-4 disabled:opacity-50">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-green-800 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}