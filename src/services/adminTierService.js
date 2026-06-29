import adminAxiosInstance from '../api/adminAxiosInstance';

const adminTierService = {
  getTiers() {
    return adminAxiosInstance.get('/api/admin/tiers');
  },
  updateTier(id, data) {
    return adminAxiosInstance.put(`/api/admin/tiers/${id}`, data);
  },
};

export default adminTierService;