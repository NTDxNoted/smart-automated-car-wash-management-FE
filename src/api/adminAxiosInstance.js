import axios from "axios";

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const adminToken =
      localStorage.getItem("admin_token");

    if (adminToken) {
      config.headers.Authorization =
        `Bearer ${adminToken}`;
    }

    return config;
  }
);

// Response interceptor to handle errors (specifically 401 Unauthorized / 403 Forbidden for Single Session Lock)
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and user info from localStorage
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      // Redirect to login page if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxiosInstance;