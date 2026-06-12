import axiosInstance from '../api/axiosInstance';

const USE_MOCK_DATA = false; // Gạt thành false khi backend deploy API thật

// ─────────────────────────────────────────────────────────────────────────────
// 📦 1. KHO DỮ LIỆU ẢO MOCK DỊCH VỤ CHUẨN THEO DATABASE SQL CỦA BẠN
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_SERVICES = [
    { ServiceID: 1, ServiceName: "Rửa xe cơ bản", ServiceCategory: "Basic", Description: "Rửa ngoài, sấy khô, lau kính", Price: 80000, Duration: 20 },
    { ServiceID: 2, ServiceName: "Rửa xe cao cấp", ServiceCategory: "Premium", Description: "Rửa toàn diện + xịt bóng ngoại thất", Price: 150000, Duration: 35 },
    { ServiceID: 3, ServiceName: "Rửa + Hút bụi nội thất", ServiceCategory: "Premium", Description: "Rửa ngoài và hút bụi toàn bộ nội thất", Price: 220000, Duration: 50 },
    { ServiceID: 4, ServiceName: "Rửa chi tiết toàn bộ", ServiceCategory: "Detail", Description: "Dịch vụ cao cấp nhất — trong và ngoài hoàn hảo", Price: 350000, Duration: 90 },
    { ServiceID: 5, ServiceName: "Đánh bóng & bảo vệ sơn", ServiceCategory: "AddOn", Description: "Đánh bóng lớp sơn + phủ ceramic nano", Price: 200000, Duration: 45 }
];

// ─────────────────────────────────────────────────────────────────────────────
// 📦 2. HÀM TỰ ĐỘNG SINH 7 NGÀY VÀ CÁC SLOT GIỜ ẢO (TIME SLOT PICKER)
// ─────────────────────────────────────────────────────────────────────────────
const generateMockTimeSlots = () => {
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const mockData = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dateVal = String(d.getDate()).padStart(2, '0');
        const fullDateStr = `${year}-${month}-${dateVal}`;

        mockData.push({
            dateStr: fullDateStr,
            label: dateVal,
            dayOfWeek: daysOfWeek[d.getDay()],
            slots: [
                { time: "07:30", isAvailable: true },
                { time: "08:00", isAvailable: true },
                { time: "08:30", isAvailable: i !== 0 },
                { time: "09:00", isAvailable: true },
                { time: "09:30", isAvailable: i !== 1 },
                { time: "10:00", isAvailable: true },
                { time: "10:30", isAvailable: true },
                { time: "11:00", isAvailable: true },
                { time: "14:00", isAvailable: true },
                { time: "14:30", isAvailable: false },
                { time: "15:00", isAvailable: true },
                { time: "15:30", isAvailable: true },
            ]
        });
    }
    return mockData;
};

// ─────────────────────────────────────────────────────────────────────────────
// 📦 3. MOCK DATA CHO BOOKING HISTORY (FE-ISSUE-05)
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
    {
        bookingId: "BK-20250101", vehiclePlate: "51A-12345",
        serviceName: "Rửa xe cao cấp Premium",
        scheduledTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // +3h → nút hủy hiện
        status: "Pending",
        baseAmount: 250000, tierDiscount: 25000, promotionDiscount: 0, rewardDiscount: 0,
        finalAmount: 225000, pointsEarned: 22, pointsRefunded: 0,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        bookingId: "BK-20250102", vehiclePlate: "51B-67890",
        serviceName: "Bảo dưỡng định kỳ 5000km",
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // +30 phút → nút hủy ẩn (BR-63)
        status: "Pending",
        baseAmount: 850000, tierDiscount: 85000, promotionDiscount: 50000, rewardDiscount: 0,
        finalAmount: 715000, pointsEarned: 71, pointsRefunded: 0,
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
        bookingId: "BK-20250098", vehiclePlate: "51A-12345",
        serviceName: "Đánh bóng sơn Ceramic Coating",
        scheduledTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Completed",
        baseAmount: 1500000, tierDiscount: 150000, promotionDiscount: 0, rewardDiscount: 100000,
        finalAmount: 1250000, pointsEarned: 125, pointsRefunded: 0,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        bookingId: "BK-20250090", vehiclePlate: "51C-11111",
        serviceName: "Rửa xe tiêu chuẩn",
        scheduledTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Cancelled",
        baseAmount: 120000, tierDiscount: 0, promotionDiscount: 0, rewardDiscount: 0,
        finalAmount: 120000, pointsEarned: 0, pointsRefunded: 12,
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        bookingId: "BK-20250085", vehiclePlate: "51B-67890",
        serviceName: "Bảo dưỡng toàn diện",
        scheduledTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Failed",
        baseAmount: 2200000, tierDiscount: 220000, promotionDiscount: 0, rewardDiscount: 0,
        finalAmount: 1980000, pointsEarned: 0, pointsRefunded: 0,
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        bookingId: "BK-20250080", vehiclePlate: "51A-12345",
        serviceName: "Rửa xe + Hút bụi nội thất",
        scheduledTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: "No-show",
        baseAmount: 180000, tierDiscount: 18000, promotionDiscount: 0, rewardDiscount: 0,
        finalAmount: 162000, pointsEarned: 0, pointsRefunded: 0,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 HELPER
// ─────────────────────────────────────────────────────────────────────────────
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 BOOKING SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const bookingService = {

    // ── FE-ISSUE-04: Lấy danh sách khung giờ trống ───────────────────────────
    // GET /api/bookings/available-slots?startDate=YYYY-MM-DD
    getAvailableSlots: async (startDate) => {
        if (USE_MOCK_DATA) {
            await delay(400);
            return generateMockTimeSlots();
        }
        const response = await axiosInstance.get('/bookings/available-slots', { params: { startDate } });
        return response.data;
    },

    // ── FE-ISSUE-04: Lấy danh sách dịch vụ ──────────────────────────────────
    // GET /api/services
    getServices: async () => {
        if (USE_MOCK_DATA) {
            await delay(300);
            return MOCK_SERVICES;
        }
        const response = await axiosInstance.get('/services');
        return response.data.data || response.data;
    },

    // ── FE-ISSUE-04: Lấy danh sách xe của member ─────────────────────────────
    // GET /api/vehicles
    getVehicles: async () => {
        if (USE_MOCK_DATA) {
            await delay(500);
            return [
                { id: 'v1', licensePlate: '29A-12345', model: 'Mercedes C200' },
                { id: 'v2', licensePlate: '30H-99999', model: 'Porsche Taycan' },
            ];
        }
        const response = await axiosInstance.get('/vehicles');
        return response.data.data || response.data;
    },

    // ── FE-ISSUE-04: Validate mã khuyến mãi ──────────────────────────────────
    // GET /api/promotions/validate?code=xxx
    validatePromo: async (code) => {
        if (USE_MOCK_DATA) {
            await delay(500);
            if (code.toUpperCase() === 'WELCOME2025') {
                return { promotionId: 1, discountType: 'Fixed_Amount', discountValue: 30000, isValid: true };
            } else if (code.toUpperCase() === 'WEEKEND50') {
                return { promotionId: 4, discountType: 'Fixed_Amount', discountValue: 50000, isValid: true };
            } else {
                throw { response: { data: { code: 'PROMO_INVALID', message: 'Mã giảm giá không tồn tại hoặc hết hạn' } } };
            }
        }
        const response = await axios.get(`/api/promotions/validate?code=${code}`);
        return response.data;
    },

    // ── FE-ISSUE-04: Tạo booking mới ─────────────────────────────────────────
    // POST /api/bookings
    createBooking: async (bookingData) => {
        if (USE_MOCK_DATA) {
            await delay(1000);
            return {
                bookingId: 'BK-' + Math.floor(Math.random() * 90000 + 10000),
                scheduledTime: bookingData.scheduledTime,
                status: 'Pending',
                invoice: {
                    baseAmount: bookingData.baseAmount || 150000,
                    discountApplied: bookingData.discountApplied || 0,
                    finalAmount: bookingData.finalAmount || 150000,
                }
            };
        }
        const response = await axiosInstance.post('/bookings', bookingData);
        return response.data;
    },

    // ── FE-ISSUE-05: Lấy danh sách booking của member ────────────────────────
    // GET /api/bookings?status=xxx&page=x
    // ── FE-ISSUE-05: Lấy danh sách lịch sử đặt lịch của tôi ──────────────────
    // ── FE-ISSUE-05: Lấy danh sách lịch sử đặt lịch của tôi ──────────────────
    // ── FE-ISSUE-05: Lấy danh sách lịch sử đặt lịch của tôi ──────────────────
    // ── FE-ISSUE-05: Lấy danh sách lịch sử đặt lịch của tôi ──────────────────
    getMyBookings: async ({ status, page = 1, pageSize = 5 }) => {
        // 🚀 LUỒNG 1: CHẠY MOCK DATA (Tối ưu hiệu năng, sạch sẽ)
        if (USE_MOCK_DATA) {
            await delay(400);

            // Lấy thông tin user đăng nhập thực tế (Issue 2 lưu vào 'aw_user')
            const storedUser = localStorage.getItem('aw_user') ? JSON.parse(localStorage.getItem('aw_user')) : null;
            const currentCustomerId = storedUser?.customerId || 'CUS-0001';

            // TỐI ƯU HIỆU NĂNG: Lọc trực tiếp bằng biểu thức điều kiện, không dùng .map() lãng phí bộ nhớ
            let filtered = MOCK_BOOKINGS.filter(b => {
                // Điều kiện 1: Khớp với chính tài khoản đang login (hoặc tài khoản mẫu)
                const isMyBooking = b.customerId === currentCustomerId || b.customerId === 'CUS-0001';

                // Điều kiện 2: Khớp với Tab trạng thái được bấm
                if (status && status !== 'all' && status !== 'Tất cả') {
                    return isMyBooking && b.status.toLowerCase() === status.toLowerCase();
                }
                return isMyBooking;
            });

            // Phân trang chuẩn thuật toán toán học
            const totalItems = filtered.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const start = (page - 1) * pageSize;
            const paginatedData = filtered.slice(start, start + pageSize);

            return {
                data: paginatedData,
                pagination: {
                    page,
                    pageSize,
                    totalItems,
                    totalPages
                }
            };
        }

        // 🚀 LUỒNG 2: CHẠY API THẬT KẾT NỐI DATABASE (Cam kết không lỗi)
        // Khi gạt USE_MOCK_DATA = false, Axios sẽ bắn request lên Backend.
        // Backend (SQL/Supabase) sẽ tự dùng câu lệnh "WHERE CustomerID = ..." để lọc dưới DB và trả về.
        const response = await axiosInstance.get('/bookings/my-bookings', { params: { status, page, pageSize } });
        return response.data;
    },
    // ── FE-ISSUE-05: Lấy chi tiết một booking ────────────────────────────────
    // GET /api/bookings/{id}
    getBookingDetail: async (id) => {
        if (USE_MOCK_DATA) {
            await delay(400);
            // SỬA TẠI ĐÂY: Đổi từ === sang == để so sánh linh hoạt giữa Số và Chuỗi
            const booking = MOCK_BOOKINGS.find(b => b.bookingId == id);
            if (!booking) throw { response: { data: { code: 'BOOKING_NOT_FOUND' } } };
            return booking;
        }
        const response = await axios.get(`/api/bookings/${id}`);
        return response.data;
    },

    // ── FE-ISSUE-05: Hủy booking ─────────────────────────────────────────────
    // POST /api/bookings/{id}/cancel
    // → trả { bookingId, status: 'Cancelled', pointsRefunded }
    // Note: BR-63 — frontend check 2h để ẩn/hiện nút; backend validate độc lập
    cancelBooking: async (id) => {
        if (USE_MOCK_DATA) {
            await delay(800);
            const booking = MOCK_BOOKINGS.find(b => b.bookingId == id);
            if (!booking) throw { response: { data: { code: 'BOOKING_NOT_FOUND' } } };
            if (booking.status !== 'Pending') throw { response: { data: { code: 'BOOKING_NOT_CANCELLABLE' } } };
            const diffHours = (new Date(booking.scheduledTime) - new Date()) / (1000 * 60 * 60);
            if (diffHours < 2) throw { response: { data: { code: 'CANCELLATION_TIME_EXCEEDED' } } };

            const pointsRefunded = Math.floor(booking.finalAmount / 10000);
            booking.status = 'Cancelled';
            booking.pointsRefunded = pointsRefunded;

            return { bookingId: id, status: 'Cancelled', pointsRefunded };
        }
        const response = await axios.post(`/api/bookings/${id}/cancel`);
        return response.data;
    },
};

