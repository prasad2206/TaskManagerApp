// src/pages/Register.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().required("Email is required").email("Invalid email address"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
}).required();

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "" }
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/register", data);
      toast.success("Registration successful. Please login!");
      // navigate to login; toast will still be visible because ToastContainer is global
      navigate("/login");
    } catch (err) {
      console.error(err);
      // handle FluentValidation-style or generic backend errors
      const resp = err?.response?.data;
      if (resp?.errors && Array.isArray(resp.errors)) {
        // map first field error to form field (if possible)
        resp.errors.forEach(e => {
          if (e.propertyName && e.errorMessage) {
            const field = e.propertyName.charAt(0).toLowerCase() + e.propertyName.slice(1);
            setError(field, { type: "server", message: e.errorMessage });
          }
        });
      } else if (resp?.message) {
        // generic message
        toast.error(resp.message);
      } else {
        toast.error("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-4 text-center">Create Account</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            {...register("name")}
            placeholder="Enter your name"
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email")}
            placeholder="you@example.com"
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...register("password")}
            placeholder="Minimum 6 characters"
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
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
