import axiosInstance from '../api/axiosInstance';

const adminPromotionService = {
  getPromotions() {
    return axiosInstance.get('/admin/promotions');
  },
  createPromotion(data) {
    return axiosInstance.post('/admin/promotions', data);
  },
  updatePromotion(id, data) {
    return axiosInstance.put(`/admin/promotions/${id}`, data);
  },
  togglePromotion(id) {
    return axiosInstance.patch(`/admin/promotions/${id}/toggle`);
  },
};

export default adminPromotionService;