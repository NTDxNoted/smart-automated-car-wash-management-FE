import axiosClient from "./axiosClient";

const adminBookingService = {
  getAll(params) {
    return axiosClient.get("/admin/bookings", {
      params,
    });
  },

  getDetail(id) {
    return axiosClient.get(
      `/admin/bookings/${id}`
    );
  },

  updateStatus(id, status) {
    return axiosClient.patch(
      `/admin/bookings/${id}/status`,
      { status }
    );
  },

  payment(id, payload) {
    return axiosClient.post(
      `/admin/bookings/${id}/payment`,
      payload
    );
  },
};

export default adminBookingService;