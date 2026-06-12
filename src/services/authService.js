import axios from "axios";

const USE_MOCK_DATA = false; // Gạt thành false khi backend deploy API thật

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:59153";
const baseURL = import.meta.env.VITE_API_BASE_URL ? `${API_BASE}/auth` : `${API_BASE}/api/auth`;

const authApi = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

// ─────────────────────────────────────────────────────────────────────────────
// 📦 MOCK ACCOUNTS
// Thêm/sửa tài khoản test tại đây khi cần
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_ACCOUNTS = [
  {
    customerId: "CUS-0001",
    fullName: "Nguyễn Văn Anh",
    phone: "0901234567",
    password: "123456",
    tier: "Gold",
    loyaltyPoints: 320,
    suspendedUntil: null,
  },
  {
    customerId: "CUS-0002",
    fullName: "Trần Thị Bảo",
    phone: "0912345678",
    password: "123456",
    tier: "Silver",
    loyaltyPoints: 85,
    suspendedUntil: null,
  },
  {
    customerId: "CUS-0003",
    fullName: "Lê Minh Khoa",
    phone: "0923456789",
    password: "123456",
    tier: "Member",
    loyaltyPoints: 10,
    suspendedUntil: null,
  },
  {
    // Tài khoản bị khoá — để test UI ACCOUNT_LOCKED
    customerId: "CUS-0099",
    fullName: "Phạm Tài Khoản Khoá",
    phone: "0999999999",
    password: "123456",
    tier: "Member",
    loyaltyPoints: 0,
    suspendedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Tạo mock JWT token (không verify được, chỉ dùng để AuthContext không bị null)
const mockToken = (customerId) => `mock.${btoa(customerId)}.token`;

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
  if (USE_MOCK_DATA) {
    await delay(700);
    const account = MOCK_ACCOUNTS.find(a => a.phone === phone);

    if (!account) {
      throw Object.assign(new Error("INVALID_CREDENTIALS"), { code: "INVALID_CREDENTIALS" });
    }
    if (account.password !== password) {
      throw Object.assign(new Error("INVALID_CREDENTIALS"), { code: "INVALID_CREDENTIALS" });
    }
    if (account.suspendedUntil && new Date(account.suspendedUntil) > new Date()) {
      throw Object.assign(new Error("ACCOUNT_LOCKED"), { code: "ACCOUNT_LOCKED", suspendedUntil: account.suspendedUntil });
    }

    const { password: _, ...safeAccount } = account;
    return { ...safeAccount, token: mockToken(account.customerId) };
  }

  // ── Real API ──
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
  if (USE_MOCK_DATA) {
    await delay(800);

    if (MOCK_ACCOUNTS.find(a => a.phone === phone)) {
      throw Object.assign(new Error("PHONE_ALREADY_EXISTS"), { code: "PHONE_ALREADY_EXISTS" });
    }

    // Tạo account mới và đẩy vào mock store (tồn tại trong session hiện tại)
    const newAccount = {
      customerId: `CUS-${String(MOCK_ACCOUNTS.length + 1).padStart(4, '0')}`,
      fullName,
      phone,
      password,
      tier: "Member",
      loyaltyPoints: 0,
      suspendedUntil: null,
    };
    MOCK_ACCOUNTS.push(newAccount);

    const { password: _, ...safeAccount } = newAccount;
    return safeAccount;
  }

  // ── Real API ──
  try {
    const { data } = await authApi.post("/register", { fullName, phone, password, confirmPassword });
    return data;
  } catch (err) {
    const code = extractErrorCode(err);
    const status = err?.response?.status;
    if (code === "PHONE_ALREADY_EXISTS" || status === 409)
      throw Object.assign(new Error("PHONE_ALREADY_EXISTS"), { code: "PHONE_ALREADY_EXISTS" });
    if (code)
      throw Object.assign(new Error(code), { code });
    throw new Error("NETWORK_ERROR");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚪 logout
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Clears token from localStorage — AuthContext reset is caller's responsibility.
 */
export function logout() {
  localStorage.removeItem("aw_token");
  localStorage.removeItem("aw_user");
}
