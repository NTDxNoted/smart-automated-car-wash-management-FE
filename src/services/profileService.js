import axiosInstance from '../api/axiosInstance';

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

// Helper to resolve user-friendly tier display name
export function getTierDisplayName(tier) {
  const tStr = String(tier !== undefined && tier !== null ? tier : '').trim().toUpperCase();
  if (tStr === '4' || tStr === 'PLATINUM') return 'Platinum';
  if (tStr === '3' || tStr === 'GOLD') return 'Gold';
  if (tStr === '2' || tStr === 'SILVER') return 'Silver';
  return 'Member';
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PROFILE SERVICE (REST API Integration)
// ─────────────────────────────────────────────────────────────────────────────
export const profileService = {

  // GET /api/profile
  getProfile: async () => {
    const response = await axiosInstance.get('/profile');
    return response.data;
  },

  // PUT /api/profile
  updateProfile: async ({ fullName }) => {
    const response = await axiosInstance.put('/profile', { fullName });
    return response.data;
  },
};
