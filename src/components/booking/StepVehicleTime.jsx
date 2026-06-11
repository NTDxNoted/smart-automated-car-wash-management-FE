import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';

export default function StepVehicleTime({ bookingData, setBookingData, onNext, onBack, user }) {
    const [vehicles, setVehicles] = useState([]);
    const [errors, setErrors] = useState({});

    // --- [VỊ TRÍ THAY ĐỔI 1: BỔ SUNG STATE QUẢN LÝ LỊCH CHỌN GRID] ---
    const [availableDays, setAvailableDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(''); // Lưu trữ chuỗi ngày YYYY-MM-DD
    const [selectedTime, setSelectedTime] = useState(''); // Lưu trữ chuỗi giờ HH:mm
    const [loadingSlots, setLoadingSlots] = useState(true);

    // Tính toán Booking Window theo Tier từ AuthContext (BR-15 -> BR-18)
    const getBookingWindowDays = (tier) => {
        switch (tier?.toUpperCase()) {
            case 'DIAMOND': return 30;
            case 'GOLD': return 15;
            case 'SILVER': return 10;
            case 'MEMBER':
            default: return 7; // Mặc định 7 ngày
        }
    };

    const bookingWindowDays = getBookingWindowDays(user?.tier);

    // --- [VỊ TRÍ THAY ĐỔI 2: REWRITE EFFECT ĐỂ TỰ ĐỘNG ĐỌC MOCK GIỜ TỪ SERVICE] ---
    useEffect(() => {
        // 1. Fetch danh sách xe nếu là Member đã đăng nhập
        if (user) {
            bookingService.getVehicles()
                .then(data => {
                    setVehicles(data);
                    if (data.length > 0 && !bookingData.selectedVehicleId) {
                        setBookingData(prev => ({
                            ...prev,
                            selectedVehicleId: data[0].id,
                            licensePlate: data[0].licensePlate
                        }));
                    }
                })
                .catch(err => console.error("Lỗi fetch xe:", err));
        }

        // 2. Gọi hàm lấy các Slot lịch trống ảo/thật từ bookingService
        const todayStr = new Date().toISOString().split('T')[0];
        setLoadingSlots(true);
        bookingService.getAvailableSlots(todayStr)
            .then(data => {
                // Giới hạn số ngày hiển thị theo đặc quyền phân hạng Tier của User (MEMBER=7 ngày, SILVER=10 ngày...)
                const allowedDays = data.slice(0, bookingWindowDays);
                setAvailableDays(allowedDays);
                setLoadingSlots(false);

                // Khôi phục lại trạng thái cũ nếu người dùng nhấn "Quay lại" từ các bước sau
                if (bookingData.scheduledTime && bookingData.scheduledTime.includes('T')) {
                    const [savedDate, savedTime] = bookingData.scheduledTime.split('T');
                    setSelectedDate(savedDate);
                    setSelectedTime(savedTime);
                }
            })
            .catch(err => {
                console.error("Lỗi fetch slot giờ trống:", err);
                setLoadingSlots(false);
            });
    }, [user, bookingWindowDays]);

    // Hàm đồng bộ ngày giờ được click chọn vào State tổng
    const handleSelectSlot = (dateStr, timeStr) => {
        setSelectedDate(dateStr);
        setSelectedTime(timeStr);
        setBookingData(prev => ({
            ...prev,
            scheduledTime: `${dateStr}T${timeStr}` // Gộp chuỗi theo định dạng chuẩn ISO để lưu xuống DB
        }));
    };

    const handleVehicleChange = (vehicleId) => {
        const selected = vehicles.find(v => v.id === vehicleId);
        setBookingData(prev => ({
            ...prev,
            selectedVehicleId: vehicleId,
            licensePlate: selected ? selected.licensePlate : ''
        }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!bookingData.phone.trim()) tempErrors.phone = "Số điện thoại là bắt buộc";
        if (!bookingData.licensePlate.trim()) tempErrors.licensePlate = "Biển số xe là bắt buộc";

        // Validate kiểm tra xem đã click chọn slot trên lưới chưa
        if (!selectedDate || !selectedTime) {
            tempErrors.scheduledTime = "Vui lòng bấm chọn một khung giờ hẹn cụ thể trên lịch";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    // Tìm danh sách khung giờ thuộc ngày đang được nhấn chọn hiện tại
    const activeDaySlots = availableDays.find(d => d.dateStr === selectedDate)?.slots || [];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-heading text-cyan-600 font-semibold mb-4">Bước 2: Thông tin xe và Thời gian đặt lịch</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!user ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Số điện thoại khách hàng</label>
                            <input
                                type="text"
                                placeholder="Nhập số điện thoại"
                                value={bookingData.phone}
                                onChange={e => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Biển số xe</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: 30F-12345"
                                value={bookingData.licensePlate}
                                onChange={e => setBookingData(prev => ({ ...prev, licensePlate: e.target.value }))}
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            />
                            {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>}
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Số điện thoại</label>
                            <input
                                type="text"
                                value={bookingData.phone}
                                disabled
                                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Chọn Xe Của Bạn</label>
                            <select
                                value={bookingData.selectedVehicleId}
                                onChange={e => handleVehicleChange(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-cyan-500"
                            >
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id} className="bg-white">{v.model} ({v.licensePlate})</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* --- [VỊ TRÍ THAY ĐỔI 3: THAY ĐỔI TOÀN BỘ Ô INPUT DATETIME BẰNG GRID ĐẸP MẮT] --- */}
                <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-medium text-slate-600">
                        Lịch hẹn thời gian khả dụng <span className="text-xs text-slate-400">(Tối đa đặt trước {bookingWindowDays} ngày theo hạng {user?.tier || 'GUEST'})</span>
                    </label>

                    {loadingSlots ? (
                        <div className="text-center py-6 text-sm text-neutral-400 animate-pulse"> đang tải danh sách lịch trống...</div>
                    ) : (
                        <div className="bg-neutral-900/40 p-5 rounded-xl border border-white/5 space-y-5">

                            {/* Hàng ngang chứa các tab chọn Ngày */}
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {availableDays.map((day) => {
                                    const isDaySelected = selectedDate === day.dateStr;
                                    return (
                                        <button
                                            key={day.dateStr}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDate(day.dateStr);
                                                setSelectedTime(''); // Reset giờ về trống khi chuyển đổi sang ngày khác
                                            }}
                                            className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${isDaySelected
                                                    ? 'bg-cyan-500 border-cyan-400 text-white font-bold shadow-md'
                                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                                }`}
                                        >
                                            <span className={`text-[10px] uppercase tracking-wider ${isDaySelected ? 'text-white' : 'text-slate-500'}`}>
                                                {day.dayOfWeek}
                                            </span>
                                            <span className="text-base font-bold font-mono">
                                                {day.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Khung lưới hiển thị danh sách giờ tương ứng */}
                            <div className="pt-2">
                                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                                    Khung giờ trống trong ngày: {selectedDate ? <span className="text-cyan-600 font-mono font-bold">{selectedDate}</span> : <span className="text-amber-500 italic font-normal">(Hãy bấm chọn một ngày ở trên)</span>}
                                </span>

                                {selectedDate && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                        {activeDaySlots.map((slot, index) => {
                                            const isTimeSelected = selectedTime === slot.time;

                                            if (!slot.isAvailable) {
                                                return (
                                                    <button
                                                        key={index}
                                                        disabled
                                                        className="p-2 text-xs rounded-lg bg-slate-100 border border-dashed border-slate-300 text-slate-400 cursor-not-allowed text-center"
                                                    >
                                                        {slot.time} (Kín)
                                                    </button>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSelectSlot(selectedDate, slot.time)}
                                                    className={`p-2 text-xs font-mono font-semibold rounded-lg border transition-all text-center ${isTimeSelected
                                                            ? 'bg-cyan-50 text-cyan-600 border-cyan-500 shadow-sm'
                                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                                        }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {errors.scheduledTime && <p className="text-red-400 text-xs mt-1">{errors.scheduledTime}</p>}
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-200">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-medium rounded-lg transition-all"
                >
                    Quay lại
                </button>
                <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-md"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}