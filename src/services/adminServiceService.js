import adminAxiosInstance from '../api/adminAxiosInstance';

const adminServiceService = {
  getAdminServices() {
    return adminAxiosInstance.get('/api/admin/services');
  },
  createService(data) {
    return adminAxiosInstance.post('/api/admin/services', data);
  },
  updateService(id, data) {
    return adminAxiosInstance.put(`/api/admin/services/${id}`, data);
  },
  toggleServiceStatus(id) {
    return adminAxiosInstance.patch(`/api/admin/services/${id}/status`);
  },
};

export default adminServiceService;