import axiosInstance from '../api/axiosInstance';

export const promotionService = {
  // GET /api/promotions/my-notifications or fallback GET /api/promotions
  getPromotions: async () => {
    try {
      const response = await axiosInstance.get('/promotions/my-notifications');
      return response.data?.data || response.data || [];
    } catch (err) {
      try {
        const fallback = await axiosInstance.get('/promotions');
        return fallback.data?.data || fallback.data || [];
      } catch (e) {
        return [];
      }
    }
  }
};

export default promotionService;
