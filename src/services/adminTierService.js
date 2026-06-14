import axiosInstance from '../api/axiosInstance';

const adminTierService = {
  getTiers() {
    return axiosInstance.get('/admin/tiers');
  },
  updateTier(id, data) {
    return axiosInstance.put(`/admin/tiers/${id}`, data);
  },
};

export default adminTierService;