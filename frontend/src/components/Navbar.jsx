import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">TaskManager</Link>

        <div className="d-flex">
          <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
          <Link className="btn btn-light" to="/register">Register</Link>
        </div>
      </div>
    </nav>
  );
}
