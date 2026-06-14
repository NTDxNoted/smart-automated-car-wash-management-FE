import axiosInstance from '../api/axiosInstance';

const USE_MOCK_DATA = false; // Gạt thành false khi backend deploy API thật

// ─────────────────────────────────────────────────────────────────────────────
// 📦 MOCK DATA VEHICLES
// ─────────────────────────────────────────────────────────────────────────────
let MOCK_VEHICLES = [
  { id: 'v1', licensePlate: '29A-12345', model: 'Mercedes C200', isActive: true },
  { id: 'v2', licensePlate: '30H-99999', model: 'Porsche Taycan', isActive: true },
];

// OTP mock cứng = 123456 để test (BR-10)
// Khi backend deploy: xóa dòng này, gạt USE_MOCK_DATA = false là xong
const MOCK_OTP = '123456';

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 HELPER
// ─────────────────────────────────────────────────────────────────────────────
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
let mockIdCounter = 3;

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 VEHICLE SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const vehicleService = {

  // GET /api/vehicles
  // → [{ id, licensePlate, model, isActive }]
  // NOTE: bookingService.getVehicles() vẫn tồn tại độc lập cho dropdown trong
  // booking flow (FE-ISSUE-04). Service này quản lý CRUD đầy đủ cho Profile tab.
  getVehicles: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return MOCK_VEHICLES.filter(v => v.isActive);
    }
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
  // → { message: 'OTP đã được gửi đến SĐT của bạn' }
  // BR-10: Bước 1 của OTP flow — nhập biển số → gửi OTP về SĐT đã đăng ký
  requestOtp: async ({ licensePlate }) => {
    if (USE_MOCK_DATA) {
      await delay(700);
      // Validate format biển số cơ bản
      const plateRegex = /^[0-9]{2}[A-Z]-[0-9]{4,5}$/;
      if (!plateRegex.test(licensePlate.toUpperCase())) {
        throw { response: { data: { code: 'INVALID_LICENSE_PLATE', message: 'Biển số không đúng định dạng (VD: 51A-12345)' } } };
      }
      return { message: 'OTP đã được gửi đến SĐT của bạn' };
    }
    const response = await axiosInstance.post('/vehicles/request-otp', { licensePlate });
    return response.data;
  },

  // POST /api/vehicles
  // body: { licensePlate, otp }
  // → { id, licensePlate, model, isActive }
  // BR-10: Bước 2 — xác nhận OTP → thêm xe
  addVehicle: async ({ licensePlate, otp }) => {
    if (USE_MOCK_DATA) {
      await delay(800);
      if (otp !== MOCK_OTP) {
        throw { response: { data: { code: 'OTP_INVALID', message: 'Mã OTP không đúng hoặc đã hết hạn' } } };
      }
      const duplicate = MOCK_VEHICLES.find(
        v => v.licensePlate.toUpperCase() === licensePlate.toUpperCase() && v.isActive
      );
      if (duplicate) {
        throw { response: { data: { code: 'PLATE_ALREADY_EXISTS', message: 'Biển số này đã được đăng ký' } } };
      }
      const newVehicle = {
        id: `v${mockIdCounter++}`,
        licensePlate: licensePlate.toUpperCase(),
        model: 'Chưa cập nhật',
        isActive: true,
      };
      MOCK_VEHICLES.push(newVehicle);
      return newVehicle;
    }
    const response = await axiosInstance.post('/vehicles', { licensePlate, otp });
    return response.data;
  },

  // PUT /api/vehicles/{id}
  // body: { licensePlate, otp }
  // → { id, licensePlate, model, isActive }
  // BR-10: OTP flow tương tự addVehicle — bước 1 gửi OTP, bước 2 xác nhận
  updateVehicle: async (id, { licensePlate, otp }) => {
    if (USE_MOCK_DATA) {
      await delay(800);
      if (otp !== MOCK_OTP) {
        throw { response: { data: { code: 'OTP_INVALID', message: 'Mã OTP không đúng hoặc đã hết hạn' } } };
      }
      const vehicle = MOCK_VEHICLES.find(v => v.id === id);
      if (!vehicle) {
        throw { response: { data: { code: 'VEHICLE_NOT_FOUND', message: 'Không tìm thấy xe' } } };
      }
      const duplicate = MOCK_VEHICLES.find(
        v => v.id !== id && v.licensePlate.toUpperCase() === licensePlate.toUpperCase() && v.isActive
      );
      if (duplicate) {
        throw { response: { data: { code: 'PLATE_ALREADY_EXISTS', message: 'Biển số này đã được đăng ký' } } };
      }
      vehicle.licensePlate = licensePlate.toUpperCase();
      return { ...vehicle };
    }
    const response = await axiosInstance.put(`/vehicles/${id}`, { licensePlate, otp });
    return response.data;
  },

  // DELETE /api/vehicles/{id}
  // → { message: 'Đã xóa xe thành công' }
  deleteVehicle: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      const vehicle = MOCK_VEHICLES.find(v => v.id === id);
      if (!vehicle) {
        throw { response: { data: { code: 'VEHICLE_NOT_FOUND', message: 'Không tìm thấy xe' } } };
      }
      // Soft delete — giữ record, đánh dấu inactive
      vehicle.isActive = false;
      return { message: 'Đã xóa xe thành công' };
    }
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  },
};

