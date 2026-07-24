import adminAxiosInstance from '../api/adminAxiosInstance';

const adminServiceService = {
  getAdminServices() {
    return adminAxiosInstance.get('/services');
  },
  createService(data) {
    return adminAxiosInstance.post('/admin/services', data);
  },
  updateService(id, data) {
    return adminAxiosInstance.put(`/admin/services/${id}`, data);
  },
  toggleStatus(id) {
    return adminAxiosInstance.patch(`/admin/services/${id}/status`);
  },
};

export default adminServiceService;