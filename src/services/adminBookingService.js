import axiosInstance from "../api/axiosInstance";

const adminBookingService = {
  getAll(params) {
    return axiosInstance.get("/admin/bookings", { params });
  },

  getDetail(id) {
    return axiosInstance.get(`/admin/bookings/${id}`);
  },

  updateStatus(id, status) {
    return axiosInstance.patch(`/admin/bookings/${id}/status`, { status });
  },

  payment(id, payload) {
    return axiosInstance.post(`/admin/bookings/${id}/payment`, payload);
  },
};

export default adminBookingService;