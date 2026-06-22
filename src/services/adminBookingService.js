import adminAxiosInstance from "../api/adminAxiosInstance";

const adminBookingService = {
  getAll(params) {
    return adminAxiosInstance.get("/admin/bookings", { params });
  },

  getDetail(id) {
    return adminAxiosInstance.get(`/admin/bookings/${id}`);
  },

  updateStatus(id, status) {
    return adminAxiosInstance.patch(`/admin/bookings/${id}/status`, { status });
  },

  payment(id, payload) {
    return adminAxiosInstance.post(`/admin/bookings/${id}/payment`, payload);
  },
};

export default adminBookingService;