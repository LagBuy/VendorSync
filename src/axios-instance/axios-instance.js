import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// Ensure baseURL has no trailing slash
const baseURL = (import.meta.env.VITE_BASE_URL || "https://api.lagbuy.com/api/v1").replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to set Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const jwt = Cookies.get("jwt-token");
    // log to the console:
    console.log(jwt);
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    } else {
      delete config.headers.Authorization;
    }
    // Set Content-Type for FormData requests
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 and 403 errors
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("jwt-token");
      toast.error("Session expired. Please log in again.");
      window.location.replace("/auth");
      
    } else if (err.response?.status === 403) {
      toast.error("You do not have permission to perform this action. Please contact your administrator.");
    }
    return Promise.reject(err);
  }
);

export { axiosInstance };