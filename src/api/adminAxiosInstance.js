import axios from "axios";

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

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }

    return Promise.reject(error);
  }
);

export default adminAxiosInstance;