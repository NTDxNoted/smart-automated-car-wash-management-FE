import axiosInstance from '../api/axiosInstance';

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 VEHICLE SERVICE (REST API Integration)
// ─────────────────────────────────────────────────────────────────────────────
export const vehicleService = {

  // GET /api/vehicles
  getVehicles: async () => {
    const response = await axiosInstance.get('/vehicles');
    const raw = response.data.data || response.data;
    return raw.map(v => ({
      id: String(v.vehicleId),
      vehicleId: v.vehicleId,
      licensePlate: v.licensePlate,
      model: v.model || '',
      isActive: v.isActive !== false,
    }));
  },

  // POST /api/vehicles/request-otp
  requestOtp: async ({ licensePlate }) => {
    const response = await axiosInstance.post('/vehicles/request-otp', { licensePlate });
    return response.data;
  },

  // POST /api/vehicles
  addVehicle: async ({ licensePlate }) => {
    const response = await axiosInstance.post('/vehicles', { licensePlate });
    return response.data;
  },

  // PUT /api/vehicles/{id}
  updateVehicle: async (id, { licensePlate }) => {
    const response = await axiosInstance.put(`/vehicles/${id}`, { licensePlate });
    return response.data;
  },

  // DELETE /api/vehicles/{id}
  deleteVehicle: async (id) => {
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  },
};
