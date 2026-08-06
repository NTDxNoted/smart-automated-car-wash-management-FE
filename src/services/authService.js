import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:59153/api";
const baseURL = `${API_BASE}/auth`;

const authApi = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

function extractErrorCode(err) {
  const data = err?.response?.data;
  if (!data) return null;
  return data.errorCode || data.message || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔐 login
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {{ phone: string, password: string }} payload
 * @returns {Promise<{ token: string, customerId: string, fullName: string, tier: string, loyaltyPoints: number, suspendedUntil: string|null }>}
 */
export async function login({ phone, password }) {
  try {
    const { data } = await authApi.post("/login", { phone, password });
    return data;
  } catch (err) {
    const code = extractErrorCode(err);
    const status = err?.response?.status;
    if (code === "ACCOUNT_LOCKED" || status === 423)
      throw Object.assign(new Error("ACCOUNT_LOCKED"), { code: "ACCOUNT_LOCKED" });
    if (status === 401)
      throw Object.assign(new Error("INVALID_CREDENTIALS"), { code: "INVALID_CREDENTIALS" });
    if (code)
      throw Object.assign(new Error(code), { code });
    throw new Error("NETWORK_ERROR");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 📝 register
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {{ fullName: string, phone: string, password: string }} payload
 * @returns {Promise<{ customerId: string, fullName: string, phone: string, tier: string, loyaltyPoints: number }>}
 */
export async function register({ fullName, phone, password, confirmPassword }) {
  try {
    const { data } = await authApi.post("/register", { fullName, phone, password, confirmPassword });
    return data;
  } catch (err) {
    const code = extractErrorCode(err);
    const status = err?.response?.status;
    const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.response?.data || "";
    const msgStr = String(serverMsg).toLowerCase();

    if (
      code === "PHONE_ALREADY_EXISTS" ||
      code === "PHONE_EXISTS" ||
      code === "DUPLICATE_PHONE" ||
      status === 409 ||
      msgStr.includes("tồn tại") ||
      msgStr.includes("đã được đăng ký") ||
      msgStr.includes("already exists") ||
      msgStr.includes("duplicate phone")
    ) {
      throw Object.assign(new Error("PHONE_ALREADY_EXISTS"), {
        code: "PHONE_ALREADY_EXISTS",
        message: "Số điện thoại này đã được đăng ký tài khoản trong hệ thống."
      });
    }

    if (code) {
      throw Object.assign(new Error(code), { code, message: serverMsg });
    }
    throw new Error("NETWORK_ERROR");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔓 logout
// ─────────────────────────────────────────────────────────────────────────────
export async function logout() {
  try {
    const { data } = await authApi.post("/logout");
    return data;
  } catch (err) {
    return { success: true };
  }
}
