import adminAxiosInstance from "../api/adminAxiosInstance";

const adminBookingService = {
  getAll(params) {
    return adminAxiosInstance.get("/api/admin/bookings", { params });
  },

  getDetail(id) {
    return adminAxiosInstance.get(`/api/admin/bookings/${id}`);
  },

  // updateStatus(id, status) {
  //   return adminAxiosInstance.patch(`/admin/Bookings/${id}/status`, { status });
  // },
  updateStatus(id, status) {
    return adminAxiosInstance.patch(`/api/admin/bookings/${id}/status`, {
      newStatus: status,
    });
  },

  payment(id, payload) {
    return adminAxiosInstance.post(`/api/admin/bookings/${id}/payment`, payload);
  },
};

export default adminBookingService;