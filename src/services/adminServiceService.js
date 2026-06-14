import axiosInstance from '../api/axiosInstance';

const adminServiceService = {
  getAdminServices() {
    return axiosInstance.get('/admin/services');
  },
  createService(data) {
    return axiosInstance.post('/admin/services', data);
  },
  updateService(id, data) {
    return axiosInstance.put(`/admin/services/${id}`, data);
  },
};

export default adminServiceService;