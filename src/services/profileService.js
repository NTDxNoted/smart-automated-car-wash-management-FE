import axios from 'axios';

const USE_MOCK_DATA = true; // Gạt thành false khi backend deploy API thật

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
    const response = await axios.get('/api/profile');
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
    const response = await axios.put('/api/profile', { fullName });
    return response.data;
  },
};
