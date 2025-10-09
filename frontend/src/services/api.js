import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7288/api", // backend URL
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

// Optional: attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
