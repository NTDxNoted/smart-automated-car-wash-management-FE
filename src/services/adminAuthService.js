import axios from "axios";

const USE_MOCK_DATA = false; // Gạt thành false để kết nối API thật của backend

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:59153";
const baseURL = import.meta.env.VITE_API_BASE_URL ? `${API_BASE}/admin/auth` : `${API_BASE}/api/admin/auth`;

const adminApi = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

const ADMIN_ACCOUNTS = [
  {
    adminId: "ADM-001",
    fullName: "System Admin",
    phone: "0903557940",
    password: "admin123",
    role: "Admin",
  },
];

const delay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const mockToken = (adminId) => `admin.${btoa(adminId)}.token`;

export async function adminLogin({ phone, password }) {
  if (USE_MOCK_DATA) {
    await delay(500);

    const admin = ADMIN_ACCOUNTS.find(
      (item) => item.phone === phone
    );

    if (!admin || admin.password !== password) {
      throw new Error("INVALID_ADMIN");
    }

    return {
      token: mockToken(admin.adminId),
      adminId: admin.adminId,
      fullName: admin.fullName,
      role: "Admin",
    };
  }

  // ── Real API ──
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