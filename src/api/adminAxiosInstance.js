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

export default adminAxiosInstance;