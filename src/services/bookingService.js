import axiosInstance from '../api/axiosInstance';

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 BOOKING SERVICE (REST API Integration)
// ─────────────────────────────────────────────────────────────────────────────
export const bookingService = {

    // ── FE-ISSUE-04: Lấy danh sách khung giờ trống ───────────────────────────
    // GET /api/bookings/available-slots?startDate=YYYY-MM-DD
    getAvailableSlots: async (startDate, licensePlate) => {
        const response = await axiosInstance.get('/bookings/available-slots', {
            params: {
                date: startDate,
                licensePlate
            }
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0].slots || [];
        }
        return [];
    },

    // ── FE-ISSUE-02: Instant License Plate Validation ─────────────────────────
    validatePlate: async (licensePlate) => {
        if (!licensePlate || licensePlate.trim().length < 4) return { isAvailable: true };
        try {
            const response = await axiosInstance.get('/bookings/available-slots', {
                params: { licensePlate: licensePlate.trim() }
            });
            return { isAvailable: true };
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.response?.data?.error || 'Biển số xe này hiện chưa thể đặt lịch (đang có đơn hoặc vừa hoàn thành trong vòng 1 giờ).';
            return { isAvailable: false, message: errorMsg };
        }
    },

    // ── FE-ISSUE-04: Lấy danh sách dịch vụ ──────────────────────────────────
    // GET /api/services
    getServices: async () => {
        const response = await axiosInstance.get('/services');
        return response.data.data || response.data;
    },

    // ── FE-ISSUE-04: Lấy danh sách xe của member ─────────────────────────────
    // GET /api/vehicles
    getVehicles: async () => {
        const response = await axiosInstance.get('/vehicles');
        const raw = response.data.data || response.data;
        return raw.map(v => ({
            id: String(v.vehicleId),        // keep as string for select value
            vehicleId: v.vehicleId,         // numeric id for CreateBookingRequest
            licensePlate: v.licensePlate,
            model: v.model || '',
            isActive: v.isActive,
        }));
    },

    // ── FE-ISSUE-04: Validate mã khuyến mãi ──────────────────────────────────
    // GET /api/promotions/validate?code=xxx
    validatePromo: async (code) => {
        const response = await axiosInstance.get(`/promotions/validate`, { params: { code } });
        return response.data;
    },

    // ── FE-ISSUE-04: Tạo booking mới ─────────────────────────────────────────
    // POST /api/bookings
    createBooking: async (bookingData) => {
        const response = await axiosInstance.post('/bookings', bookingData);
        return response.data;
    },

    // ── FE-ISSUE-05: Lấy danh sách booking của member ────────────────────────
    // GET /api/bookings?status=xxx&page=x
    getMyBookings: async ({ status, page = 1, pageSize = 5 }) => {
        const apiStatus = (status === 'all' || status === 'Tất cả') ? undefined : (status === 'No-show' ? 'NoShow' : status);
        const response = await axiosInstance.get('/bookings', { params: { status: apiStatus, page, pageSize } });
        const raw = response.data;
        const totalPages = raw.pageSize > 0 ? Math.ceil(raw.total / raw.pageSize) : 1;
        return {
            data: (raw.data || []).map(b => ({
                bookingId: b.bookingId,
                vehiclePlate: b.licensePlate,
                serviceName: b.service?.serviceName || '',
                service: b.service,
                scheduledTime: b.scheduledTime,
                status: b.status,
                baseAmount: b.service?.price || b.finalAmount,
                finalAmount: b.finalAmount,
                pointsEarned: b.pointsEarned,
                createdAt: b.createdAt,
            })),
            pagination: {
                page: raw.page || page,
                pageSize: raw.pageSize || pageSize,
                totalItems: raw.total || 0,
                totalPages,
            }
        };
    },

    // ── FE-ISSUE-05: Lấy chi tiết một booking ────────────────────────────────
    // GET /api/bookings/{id}
    getBookingDetail: async (id) => {
        const response = await axiosInstance.get(`/bookings/${id}`);
        return response.data;
    },

    // ── FE-ISSUE-05: Hủy booking ─────────────────────────────────────────────
    // POST /api/bookings/{id}/cancel
    cancelBooking: async (id) => {
        const response = await axiosInstance.post(`/bookings/${id}/cancel`);
        return response.data;
    },
};
