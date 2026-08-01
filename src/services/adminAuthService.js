import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:59153";
const baseURL = import.meta.env.VITE_API_BASE_URL ? `${API_BASE}/admin/auth` : `${API_BASE}/api/admin/auth`;

const adminApi = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

export async function adminLogin({ phone, password }) {
  const { data } = await adminApi.post("/login", { phone, password });
  return {
    token: data.token || data.Token,
    adminId: data.adminId || data.AdminId,
    fullName: data.fullName || data.FullName,
    role: data.role || data.Role || "ADMIN",
  };
}

export function adminLogout() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}