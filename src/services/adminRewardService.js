import adminAxiosInstance from '../api/adminAxiosInstance';

const adminRewardService = {
  getRewards: () => {
    return adminAxiosInstance.get('/admin/rewards');
  },
  createReward: (data) => {
    return adminAxiosInstance.post('/admin/rewards', data);
  },
  updateReward: (id, data) => {
    return adminAxiosInstance.put(`/admin/rewards/${id}`, data);
  },
  toggleReward: (id) => {
    return adminAxiosInstance.patch(`/admin/rewards/${id}/toggle`);
  },
  deleteReward: (id) => {
    return adminAxiosInstance.delete(`/admin/rewards/${id}`);
  }
};

export default adminRewardService;
