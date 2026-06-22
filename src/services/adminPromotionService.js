import adminAxiosInstance from '../api/adminAxiosInstance';

const adminPromotionService = {
  getPromotions() {
    return adminAxiosInstance.get('/admin/promotions');
  },
  createPromotion(data) {
    return adminAxiosInstance.post('/admin/promotions', data);
  },
  updatePromotion(id, data) {
    return adminAxiosInstance.put(`/admin/promotions/${id}`, data);
  },
  togglePromotion(id) {
    return adminAxiosInstance.patch(`/admin/promotions/${id}/toggle`);
  },
};

export default adminPromotionService;