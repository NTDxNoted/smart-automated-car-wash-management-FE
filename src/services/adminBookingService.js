import adminAxiosInstance from "../api/adminAxiosInstance";

const adminBookingService = {
  getAll(params) {
    const apiParams = { ...params };
    if (params?.keyword) {
      const kw = params.keyword.trim();
      if (/^[0-9+]+$/.test(kw)) {
        apiParams.phone = kw;
      } else {
        apiParams.plate = kw;
      }
      delete apiParams.keyword;
    }
    return adminAxiosInstance.get("/admin/bookings", { params: apiParams });
  },

  getDetail(id) {
    return adminAxiosInstance.get(`/admin/bookings/${id}`);
  },

  updateStatus(id, status) {
    return adminAxiosInstance.patch(`/admin/bookings/${id}/status`, { newStatus: status });
  },

  payment(id, payload) {
    return adminAxiosInstance.post(`/admin/bookings/${id}/payment`, payload);
  },

  checkin(id) {
    return adminAxiosInstance.post(`/admin/bookings/${id}/checkin`).catch((err) => {
      if (err.response?.status === 404) {
        return adminAxiosInstance.patch(`/admin/bookings/${id}`, { checkInTime: new Date().toISOString() });
      }
      throw err;
    });
  },

  updatePlate(id, licensePlate) {
    return adminAxiosInstance.patch(`/admin/bookings/${id}/license-plate`, { newLicensePlate: licensePlate }).catch((err) => {
      if (err.response?.status === 404) {
        return adminAxiosInstance.put(`/admin/bookings/${id}`, { licensePlate });
      }
      throw err;
    });
  },

  emergencyStop(id, payload) {
    return adminAxiosInstance.post(`/admin/bookings/${id}/emergency-stop`, payload || { reason: "Dừng khẩn cấp" }).catch((err) => {
      if (err.response?.status === 404) {
        return adminAxiosInstance.patch(`/admin/bookings/${id}/status`, { status: "FAILED" });
      }
      throw err;
    });
  },
};

export default adminBookingService;