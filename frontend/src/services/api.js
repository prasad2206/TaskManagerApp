import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:5001/api", // adjust backend URL if needed
});

// Attach token to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
