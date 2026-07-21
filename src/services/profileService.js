import axiosInstance from '../api/axiosInstance';

const USE_MOCK_DATA = false; // Gạt thành false khi backend deploy API thật

// ─────────────────────────────────────────────────────────────────────────────
// 📦 MOCK DATA PROFILE
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PROFILE = {
  customerId: 'CUS-00042',
  fullName: 'Nguyễn Văn Anh',
  phone: '0912345678',
  tier: 'GOLD',
  totalSpending: 2100000, // 2.1M → đang tiến tới Platinum (3M)
  loyaltyPoints: 187,
  // TODO: FE-ISSUE-XX — Hiển thị banner cảnh báo tài khoản bị suspended
  // suspendedUntil hiện chưa có UI xử lý, cần tạo issue riêng khi có spec
  suspendedUntil: null,
};

// Helper to resolve dynamic effective tier from raw tier and totalSpending
export function resolveEffectiveTier(rawTier, totalSpending = 0) {
  let calculated = 'MEMBER';
  if (totalSpending >= 3000000) calculated = 'PLATINUM';
  else if (totalSpending >= 1500000) calculated = 'GOLD';
  else if (totalSpending >= 500000) calculated = 'SILVER';

  const tStr = String(rawTier !== undefined && rawTier !== null ? rawTier : '').trim().toUpperCase();
  let explicit = 'MEMBER';
  if (tStr === '4' || tStr === 'PLATINUM') explicit = 'PLATINUM';
  else if (tStr === '3' || tStr === 'GOLD') explicit = 'GOLD';
  else if (tStr === '2' || tStr === 'SILVER') explicit = 'SILVER';

  const tierOrder = { MEMBER: 1, SILVER: 2, GOLD: 3, PLATINUM: 4 };
  return tierOrder[calculated] > tierOrder[explicit] ? calculated : explicit;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 HELPER
// ─────────────────────────────────────────────────────────────────────────────
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PROFILE SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const profileService = {

  // GET /api/profile
  // → { customerId, fullName, phone, tier, totalSpending, loyaltyPoints, suspendedUntil }
  getProfile: async () => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return { ...MOCK_PROFILE };
    }
    const response = await axiosInstance.get('/profile');
    return response.data;
  },

  // PUT /api/profile
  // → { customerId, fullName }
  updateProfile: async ({ fullName }) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      MOCK_PROFILE.fullName = fullName;
      return { customerId: MOCK_PROFILE.customerId, fullName };
    }
    const response = await axiosInstance.put('/profile', { fullName });
    return response.data;
  },
};
