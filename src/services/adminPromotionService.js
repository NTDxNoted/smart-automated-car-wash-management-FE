import adminAxiosInstance from '../api/adminAxiosInstance';

const adminPromotionService = {
  getPromotions() {
    return adminAxiosInstance.get('/api/admin/promotions');
  },
  createPromotion(data) {
    return adminAxiosInstance.post('/api/admin/promotions', data);
  },
  updatePromotion(id, data) {
    return adminAxiosInstance.put(`/api/admin/promotions/${id}`, data);
  },
  togglePromotion(id) {
    return adminAxiosInstance.patch(`/api/admin/promotions/${id}/toggle`);
  },
};

export default adminPromotionService;