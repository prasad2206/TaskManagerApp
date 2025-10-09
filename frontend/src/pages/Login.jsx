import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify"; // optional


export default function Login() {

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/login", formData);

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      setUser({ token: response.data.token });
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Invalid response from server");
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data) {
      toast.error(error.response.data.message || "Login failed!");
    } else {
      toast.error("Server not responding!");
    }
  }
};

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <ToastContainer /> {/* Toast container for notifications */}
      <h3 className="mb-3 text-center">Login to Task Manager</h3>

      <form onSubmit={handleSubmit}>
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
          Login
        </button>

        <p className="mt-3 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#0d6efd", cursor: "pointer" }}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
