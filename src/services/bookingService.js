import axios from 'axios';

const USE_MOCK_DATA = true; // Gạt thành false khi backend deploy API thật

// 📦 1. KHO DỮ LIỆU ẢO MOCK DỊCH VỤ CHUẨN THEO DATABASE SQL CỦA BẠN
const MOCK_SERVICES = [
    { ServiceID: 1, ServiceName: "Rửa xe cơ bản", ServiceCategory: "Basic", Description: "Rửa ngoài, sấy khô, lau kính", Price: 80000, Duration: 20 },
    { ServiceID: 2, ServiceName: "Rửa xe cao cấp", ServiceCategory: "Premium", Description: "Rửa toàn diện + xịt bóng ngoại thất", Price: 150000, Duration: 35 },
    { ServiceID: 3, ServiceName: "Rửa + Hút bụi nội thất", ServiceCategory: "Premium", Description: "Rửa ngoài và hút bụi toàn bộ nội thất", Price: 220000, Duration: 50 },
    { ServiceID: 4, ServiceName: "Rửa chi tiết toàn bộ", ServiceCategory: "Detail", Description: "Dịch vụ cao cấp nhất — trong và ngoài hoàn hảo", Price: 350000, Duration: 90 },
    { ServiceID: 5, ServiceName: "Đánh bóng & bảo vệ sơn", ServiceCategory: "AddOn", Description: "Đánh bóng lớp sơn + phủ ceramic nano", Price: 200000, Duration: 45 }
];

// 📦 2. HÀM TỰ ĐỘNG SINH 7 NGÀY VÀ CÁC SLOT GIỜ ẢO ĐỂ IN RA HÌNH LƯỚI (TIME SLOT PICKER)
const generateMockTimeSlots = () => {
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const mockData = [];

    // Chạy vòng lặp tạo ra dữ liệu cho 7 ngày tính từ ngày hôm nay
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i); // Tăng dần từng ngày

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dateVal = String(d.getDate()).padStart(2, '0');
        const fullDateStr = `${year}-${month}-${dateVal}`; // Định dạng chuẩn: YYYY-MM-DD

        mockData.push({
            dateStr: fullDateStr,                     // Dùng để lưu vào DB (VD: "2026-06-07")
            label: dateVal,                          // In ra số ngày trên giao diện (VD: "07")
            dayOfWeek: daysOfWeek[d.getDay()],       // In ra thứ trên giao diện (VD: "CN")
            slots: [
                { time: "07:30", isAvailable: true },
                { time: "08:00", isAvailable: true },
                { time: "08:30", isAvailable: i !== 0 }, // Giả định ngày đầu tiên (hôm nay) slot này đã có người đặt (false)
                { time: "09:00", isAvailable: true },
                { time: "09:30", isAvailable: i !== 1 }, // Giả định ngày mai slot này bận
                { time: "10:00", isAvailable: true },
                { time: "10:30", isAvailable: true },
                { time: "11:00", isAvailable: true },
                { time: "14:00", isAvailable: true },
                { time: "14:30", isAvailable: false }, // Slot cố định bận để test UI màu xám bận
                { time: "15:00", isAvailable: true },
                { time: "15:30", isAvailable: true },
            ]
        });
    }
    return mockData;
};

export const bookingService = {
    // [HÀM MỚI] Lấy lịch các khung giờ trống khả dụng
    // Truyền vào startDate để sau này API thật biết lọc từ ngày nào
    getAvailableSlots: async (startDate) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 400)); // Giả lập delay mạng 400ms
            return generateMockTimeSlots(); // Trả về cấu trúc mảng 7 ngày ở trên
        }
        // Khi backend code xong, hàm này sẽ gọi endpoint thật dưới đây:
        const response = await axios.get(`/api/bookings/available-slots`, { params: { startDate } });
        return response.data;
    },

    // GET /api/services - Lấy danh sách dịch vụ
    getServices: async () => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return MOCK_SERVICES;
        }
        const response = await axios.get('/api/services');
        return response.data;
    },

    // GET /api/vehicles - Lấy danh sách xe của member
    getVehicles: async () => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return [
                { id: 'v1', licensePlate: '29A-12345', model: 'Mercedes C200' },
                { id: 'v2', licensePlate: '30H-99999', model: 'Porsche Taycan' },
            ];
        }
        const response = await axios.get('/api/vehicles');
        return response.data;
    },

    // GET /api/promotions/validate?code=xxx
    validatePromo: async (code) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (code.toUpperCase() === 'WELCOME2025') {
                return { promotionId: 1, discountType: 'Fixed_Amount', discountValue: 30000, isValid: true };
            } else if (code.toUpperCase() === 'WEEKEND50') {
                return { promotionId: 4, discountType: 'Fixed_Amount', discountValue: 50000, isValid: true };
            } else {
                throw { response: { data: { code: 'PROMO_INVALID', message: 'Mã giảm giá không tồn tại hoặc hết hạn' } } };
            }
        }
        try {
            const response = await axios.get(`/api/promotions/validate?code=${code}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // POST /api/bookings - Gửi dữ liệu đặt lịch lên hệ thống
    createBooking: async (bookingData) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                bookingId: 'BK-' + Math.floor(Math.random() * 90000 + 10000),
                scheduledTime: bookingData.scheduledTime,
                status: 'Pending',
                invoice: {
                    baseAmount: bookingData.baseAmount || 150000,
                    discountApplied: bookingData.discountApplied || 0,
                    finalAmount: bookingData.finalAmount || 150000
                }
            };
        }
        try {
            const response = await axios.post('/api/bookings', bookingData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};