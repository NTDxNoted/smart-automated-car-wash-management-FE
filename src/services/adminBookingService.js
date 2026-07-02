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

  checkin(id) {
    return adminAxiosInstance.patch(`/admin/bookings/${id}/checkin`).catch((err) => {
      if (err.response?.status === 404) {
        return adminAxiosInstance.patch(`/admin/bookings/${id}`, { checkInTime: new Date().toISOString() });
      }
      throw err;
    });
  },

  updatePlate(id, licensePlate) {
    return adminAxiosInstance.patch(`/admin/bookings/${id}/plate`, { licensePlate }).catch((err) => {
      if (err.response?.status === 404) {
        return adminAxiosInstance.put(`/admin/bookings/${id}`, { licensePlate });
      }
      throw err;
    });
  },

  emergencyStop(id) {
    return adminAxiosInstance.post(`/admin/bookings/${id}/emergency-stop`).catch((err) => {
      if (err.response?.status === 404) {
        return adminAxiosInstance.patch(`/admin/bookings/${id}/status`, { status: "FAILED" });
      }
      throw err;
    });
  },
};

export default adminBookingService;