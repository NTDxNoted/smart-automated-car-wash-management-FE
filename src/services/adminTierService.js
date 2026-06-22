import adminAxiosInstance from '../api/adminAxiosInstance';

const adminTierService = {
  getTiers() {
    return adminAxiosInstance.get('/admin/tiers');
  },
  updateTier(id, data) {
    return adminAxiosInstance.put(`/admin/tiers/${id}`, data);
  },
};

export default adminTierService;