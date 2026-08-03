import adminAxiosInstance from '../api/adminAxiosInstance';

const adminRewardService = {
  getRewards: async () => {
    try {
      return await adminAxiosInstance.get('/admin/rewards');
    } catch (err) {
      // Fallback nếu Backend chưa mở endpoint GET /admin/rewards (hiện tại backend chỉ mới có GET /rewards)
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        return await adminAxiosInstance.get('/rewards');
      }
      throw err;
    }
  },
  createReward: (data) => {
    return adminAxiosInstance.post('/admin/rewards', data);
  },
  updateReward: (id, data) => {
    return adminAxiosInstance.put(`/admin/rewards/${id}`, data);
  },
  toggleReward: (id) => {
    return adminAxiosInstance.patch(`/admin/rewards/${id}/toggle`);
  }
};

export default adminRewardService;
