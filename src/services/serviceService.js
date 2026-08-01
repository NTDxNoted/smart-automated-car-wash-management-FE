import axiosInstance from '../api/axiosInstance';

/**
 * Lấy toàn bộ danh sách dịch vụ đang Active
 * GET /api/services
 */
export async function getServices() {
  const res = await axiosInstance.get('/services');
  return res.data.data || res.data;
}

/**
 * Lấy thông tin chi tiết một dịch vụ
 * GET /api/services/{id}
 */
export async function getServiceById(id) {
  const res = await axiosInstance.get(`/services/${id}`);
  return res.data.data || res.data;
}

/**
 * Helper: Format số tiền sang định dạng VND
 * @param {number} amount
 * @returns {string} e.g. "80,000 đ"
 */
export function formatVND(amount) {
  if (amount === undefined || amount === null) return '0 đ';
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}
