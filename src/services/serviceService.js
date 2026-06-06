/* ════════════════════════════════════════════
   serviceService.js — Cấu hình Kết Nối API & Mock Data
   ════════════════════════════════════════════ */

const BASE_URL = '/api';

// 🎛️ CÔNG TẮC CHUYỂN ĐỔI (BẬT/TẮT DỮ LIỆU ẢO)
// - Đổi thành true: Chạy dữ liệu ảo (Frontend thuần, test UI)
// - Đổi thành false: Chạy API thật (Khi Backend đã deploy xong)
const USE_MOCK_DATA = true;


// 📦 KHO DỮ LIỆU ẢO (MOCK DATA) ĐỂ DEMO
const MOCK_SERVICES = [
  {
    serviceId: "SV-001",
    serviceName: "Rửa Xe Bọt Tuyết Cao Cấp",
    serviceCategory: "Basic",
    description: "Rửa sạch sâu ngoại thất bằng công nghệ bọt tuyết siêu mịn, hút bụi khoang nội thất căn bản và dưỡng đen lốp xe.",
    price: 150000,
    duration: 30
  },
  {
    serviceId: "SV-002",
    serviceName: "Phủ Ceramic Bảo Vệ Sơn",
    serviceCategory: "Premium",
    description: "Hiệu chỉnh bề mặt sơn xóa xước dăm, phủ lớp Ceramic 9H cao cấp tạo hiệu ứng lá sen vượt trội và giữ độ bóng gương cho xe.",
    price: 4500000,
    duration: 180
  },
  {
    serviceId: "SV-003",
    serviceName: "Vệ Sinh Chi Tiết Khoang Máy",
    serviceCategory: "Detail",
    description: "Dọn dẹp dầu mỡ, bụi bẩn lâu ngày trong khoang động cơ bằng hơi nước nóng chuyên dụng, phủ dưỡng bề mặt nhựa và cao su.",
    price: 900000,
    duration: 120
  },
  {
    serviceId: "SV-004",
    serviceName: "Tẩy Ố Kính & Chống Nước Rain-X",
    serviceCategory: "AddOn",
    description: "Xử lý triệt để các vết ố mốc, mưa axit trên kính lái và kính hông, phủ lớp nano chuyên dụng giúp gạt nước trong suốt khi mưa lớn.",
    price: 350000,
    duration: 45
  },
  {
    serviceId: "SV-005",
    serviceName: "Hút Mùi & Diệt Khuẩn Ozone",
    serviceCategory: "AddOn",
    description: "Khử sạch hoàn toàn mùi thuốc lá, mùi ẩm mốc điều hòa bằng máy phát ion diệt khuẩn chuyên dụng, an toàn tuyệt đối cho sức khỏe.",
    price: 200000,
    duration: 20
  },
  {
    serviceId: "SV-006",
    serviceName: "Dọn Sạch Sâu Nội Thất Toàn Diện",
    serviceCategory: "Detail",
    description: "Tháo ghế, giặt sạch trần nỉ, thảm sàn, dưỡng lại toàn bộ bề mặt da cao cấp bằng dung dịch chuyên dụng của 3M.",
    price: 1800000,
    duration: 240
  }
];

/**
 * Lấy toàn bộ danh sách dịch vụ đang Active
 * GET /api/services
 */
export async function getServices() {
  // Nếu công tắc bật dữ liệu ảo đang ON
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_SERVICES);
      }, 600); // Giả lập mạng trễ 0.6s để hiển thị hiệu ứng Skeleton rất đẹp
    });
  }

  // Nếu công tắc dữ liệu ảo OFF -> Tự động chạy API Thật
  const res = await fetch(`${BASE_URL}/services`);
  if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
  return res.json();
}

/**
 * Lấy thông tin chi tiết một dịch vụ
 * GET /api/services/{id}
 */
export async function getServiceById(id) {
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const service = MOCK_SERVICES.find(s => String(s.serviceId) === String(id));
        if (service) resolve(service);
        else reject(new Error(`Không tìm thấy dịch vụ với ID: ${id}`));
      }, 300);
    });
  }

  const res = await fetch(`${BASE_URL}/services/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch service ${id}: ${res.status}`);
  return res.json();
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