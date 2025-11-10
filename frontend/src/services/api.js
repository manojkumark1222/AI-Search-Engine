import axios from "axios";

// API base URL - change this if your backend runs on a different port
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8888";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle connection refused errors (backend not running)
    if (
      error.code === "ECONNREFUSED" || 
      error.message?.includes("ERR_CONNECTION_REFUSED") ||
      error.message?.includes("Network Error") ||
      (error.request && !error.response)
    ) {
      error.message = "Backend server is not running. Please start the API server. Check the terminal for the actual port number.";
    }
    return Promise.reject(error);
  }
);

export default api;
