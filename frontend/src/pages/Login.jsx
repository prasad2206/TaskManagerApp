// src/pages/Login.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required"),
}).required();

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      if (res?.data?.token) {
        login(res.data.token); // AuthContext handles localStorage
        toast.success("Login Successful!");
        navigate("/");
      } else {
        toast.error("Login failed: invalid server response");
      }
    } catch (err) {
      console.error(err);
      const resp = err?.response?.data;
      if (resp?.message) {
        // show as form error on password/email
        setError("password", { type: "server", message: resp.message });
      } else {
        toast.error("Login failed. Try again.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-4 text-center">Login</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label className="form-label">Email</label>
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
            placeholder="Your password"
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
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
