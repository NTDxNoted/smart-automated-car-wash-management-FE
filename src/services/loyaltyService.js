import axiosInstance from '../api/axiosInstance';

// TODO: Thay thế bằng API thật khi Backend sẵn sàng
const USE_MOCK = false;

const mockWallet = {
  totalPoints: 125,
  canRedeem: true,
  batches: [
    { id: 1, points: 50, earnedAt: '2025-10-15T10:00:00Z', expiredAt: '2026-10-15T10:00:00Z', daysUntilExpiry: 130 },
    { id: 2, points: 25, earnedAt: '2025-12-01T15:30:00Z', expiredAt: '2026-12-01T15:30:00Z', daysUntilExpiry: 177 },
    { id: 3, points: 50, earnedAt: '2025-06-10T09:00:00Z', expiredAt: '2026-06-10T09:00:00Z', daysUntilExpiry: 2 }, // Sắp hết hạn
  ]
};

const mockHistory = [
  { id: 101, type: 'Earn', points: 50, createdAt: '2025-10-15T10:00:00Z', refBookingId: 'BK-001' },
  { id: 102, type: 'Earn', points: 100, createdAt: '2025-12-01T15:30:00Z', refBookingId: 'BK-042' },
  { id: 103, type: 'Redeem', points: -75, createdAt: '2026-01-20T14:15:00Z', refBookingId: 'BK-105' },
  { id: 104, type: 'Expire', points: -10, createdAt: '2026-03-01T00:00:00Z', refBookingId: null },
];

const mockRewards = [
  { id: 1, name: 'Giảm giá 50K', pointsRequired: 50, discountValue: 50000 },
  { id: 2, name: 'Giảm giá 100K', pointsRequired: 100, discountValue: 100000 },
  { id: 3, name: 'Miễn phí rửa xe cơ bản', pointsRequired: 150, discountValue: 150000 },
];

export const loyaltyService = {
  getLoyaltyWallet: async () => {
    if (USE_MOCK) {
      return new Promise(resolve => setTimeout(() => resolve(mockWallet), 800));
    }
    const response = await axiosInstance.get('/loyalty');
    return response.data;
  },

  getPointHistory: async (page = 1) => {
    if (USE_MOCK) {
      return new Promise(resolve => setTimeout(() => resolve(mockHistory), 800));
    }
    const response = await axiosInstance.get('/loyalty/history', { params: { page } });
    return response.data;
  },

  getRewards: async () => {
    if (USE_MOCK) {
      return new Promise(resolve => setTimeout(() => resolve(mockRewards), 800));
    }
    const response = await axiosInstance.get('/rewards');
    const raw = response.data.data || response.data;
    return (raw || []).map(r => ({
      id: r.rewardId || r.id,
      name: r.rewardName || r.name,
      description: r.description,
      pointsRequired: r.pointsRequired,
      discountType: r.discountType || r.discounttype || 'Fixed_Amount',
      discountValue: r.discountAmount !== undefined ? r.discountAmount : r.discountValue,
      discountAmount: r.discountAmount !== undefined ? r.discountAmount : r.discountValue,
      isActive: r.isActive
    }));
  },

  simulateRedeem: async ({ rewardId, baseAmount }) => {
    if (USE_MOCK) {
      const reward = mockRewards.find(r => r.id === rewardId);
      if (!reward) throw new Error('Reward not found');
      // BR-60: Tối đa 50% baseAmount
      const maxDiscount = baseAmount * 0.5;
      const applied = Math.min(reward.discountValue, maxDiscount);
      return new Promise(resolve => setTimeout(() => resolve({
        discountApplied: applied,
        finalAmount: baseAmount - applied,
        isValid: true
      }), 500));
    }
    const response = await axiosInstance.get('/loyalty/simulate', { 
      params: { rewardId, baseAmount } 
    });
    return response.data;
  }
};
