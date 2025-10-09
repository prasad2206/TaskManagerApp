import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // optional
import API from "../services/api"; // ✅ use your axios instance
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  // ✅ Password validation before sending request
  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters long!");
    return;
  }
    try {
      // ✅ Send full formData directly
      const response = await API.post("/auth/register", formData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Registration successful!");
        toast.success("Registration successful! Please login now.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Register error:", error);

      if (error.response) {
        // Backend responded with an error (like BadRequest)
        toast.error(error.response.data.message || "Registration failed!");
      } else {
        // No response from server (network or CORS)
        toast.error("Server not responding!");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-3 text-center">Create Account</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#0d6efd", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
