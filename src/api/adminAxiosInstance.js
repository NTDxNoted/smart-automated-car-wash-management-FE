import axios from "axios";
import { toast } from "react-toastify";

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

adminAxiosInstance.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin_token");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

// Response interceptor to handle errors (specifically 401 Unauthorized / 403 Forbidden)
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.clear();
      toast.error(
        "Phiên đăng nhập đã hết hạn hoặc bị đăng nhập ở thiết bị khác.",
      );
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default adminAxiosInstance;
