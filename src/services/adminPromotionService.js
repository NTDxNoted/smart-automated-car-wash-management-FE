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
  getPromoUsage(id) {
    return adminAxiosInstance.get(`/admin/promotions/${id}/usage`);
  },
  dispatchRfmAction(data) {
    return adminAxiosInstance.post('/admin/rfm/send-action', data);
  },
};

export default adminPromotionService;