import adminAxiosInstance from '../api/adminAxiosInstance';

const adminServiceService = {
  getAdminServices() {
    return adminAxiosInstance.get('/admin/services');
  },
  createService(data) {
    return adminAxiosInstance.post('/admin/services', data);
  },
  updateService(id, data) {
    return adminAxiosInstance.put(`/admin/services/${id}`, data);
  },
};

export default adminServiceService;