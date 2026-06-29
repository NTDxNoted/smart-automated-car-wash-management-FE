import adminAxiosInstance from "../api/adminAxiosInstance";

const adminBookingService = {
  getAll(params) {
    return adminAxiosInstance.get("/admin/Bookings", { params });
  },

  getDetail(id) {
    return adminAxiosInstance.get(`/admin/Bookings/${id}`);
  },

  // updateStatus(id, status) {
  //   return adminAxiosInstance.patch(`/admin/Bookings/${id}/status`, { status });
  // },
  updateStatus(id, status) {
  return adminAxiosInstance.patch(`/admin/Bookings/${id}/status`, {
    newStatus: status,
  });
},

  payment(id, payload) {
    return adminAxiosInstance.post(`/admin/Bookings/${id}/payment`, payload);
  },
};

export default adminBookingService;