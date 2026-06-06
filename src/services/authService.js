import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const authApi = axios.create({
  baseURL: `${API_BASE}/api/auth`,
  headers: { "Content-Type": "application/json" },
});

// ─── API Error Normalizer ──────────────────────────────────────────────────
// Extracts a machine-readable errorCode from different response shapes:
//   { errorCode: "PHONE_ALREADY_EXISTS" }
//   { message: "ACCOUNT_LOCKED" }
function extractErrorCode(err) {
  const data = err?.response?.data;
  if (!data) return null;
  return data.errorCode || data.message || null;
}

// ─── login ─────────────────────────────────────────────────────────────────
/**
 * @param {{ phone: string, password: string }} payload
 * @returns {Promise<{ token: string, customerId: string, fullName: string, tier: string, suspendedUntil: string|null }>}
 */
export async function login({ phone, password }) {
  try {
    const { data } = await authApi.post("/login", { phone, password });
    return data;
  } catch (err) {
    const code = extractErrorCode(err);
    const status = err?.response?.status;

    if (code === "ACCOUNT_LOCKED" || status === 423) {
      throw Object.assign(new Error("ACCOUNT_LOCKED"), { code: "ACCOUNT_LOCKED" });
    }
    if (status === 401) {
      throw Object.assign(new Error("INVALID_CREDENTIALS"), { code: "INVALID_CREDENTIALS" });
    }
    if (code) {
      throw Object.assign(new Error(code), { code });
    }
    throw new Error("NETWORK_ERROR");
  }
}

// ─── register ──────────────────────────────────────────────────────────────
/**
 * @param {{ fullName: string, phone: string, password: string }} payload
 * @returns {Promise<{ customerId: string, fullName: string, phone: string, tier: string }>}
 */
export async function register({ fullName, phone, password }) {
  try {
    const { data } = await authApi.post("/register", { fullName, phone, password });
    return data;
  } catch (err) {
    const code = extractErrorCode(err);
    const status = err?.response?.status;

    if (code === "PHONE_ALREADY_EXISTS" || status === 409) {
      throw Object.assign(new Error("PHONE_ALREADY_EXISTS"), { code: "PHONE_ALREADY_EXISTS" });
    }
    if (code) {
      throw Object.assign(new Error(code), { code });
    }
    throw new Error("NETWORK_ERROR");
  }
}

// ─── logout ────────────────────────────────────────────────────────────────
/**
 * Clears token from localStorage — AuthContext reset is caller's responsibility.
 */
export function logout() {
  localStorage.removeItem("aw_token");
  localStorage.removeItem("aw_user");
}
