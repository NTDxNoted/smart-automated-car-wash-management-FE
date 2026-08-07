import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import adminBookingService from '../../services/adminBookingService';
import './WalkInModal.css';

const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_SLOTS = [
  '07:30', '08:30', '09:30', '10:30', '11:30', '12:30',
  '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'
];

const formatCurrencyVN = (amount) => `${Number(amount).toLocaleString('vi-VN')} đ`;

export default function WalkInModal({ open, onClose, onSuccess, existingBookings = [] }) {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    plate: '',
    serviceId: '',
    bookingDate: getTodayDateStr(),
    bookingTime: '',
  });

  const [services, setServices] = useState([]);
  const [slotsList, setSlotsList] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Load services on modal open
  useEffect(() => {
    if (open) {
      bookingService.getServices()
        .then(data => {
          const list = Array.isArray(data) ? data : (data?.data || []);
          const activeServices = list.filter(s => s.isActive !== false);
          setServices(activeServices);
          if (activeServices.length > 0 && !form.serviceId) {
            setForm(prev => ({ ...prev, serviceId: String(activeServices[0].serviceId || activeServices[0].id) }));
          }
        })
        .catch(err => console.error('Lỗi lấy danh sách dịch vụ:', err));
    }
  }, [open]);

  // Helper to compute actual remaining slot count for a given slot object & date
  const getSlotCount = (slotObj, targetDate = form.bookingDate) => {
    if (!slotObj) return 0;
    const timeStr = typeof slotObj === 'string' ? slotObj : slotObj.time;
    const maxCapacity = 3;
    const bookedInList = (existingBookings || []).filter(b => {
      if (!b.scheduledTime) return false;
      const bStatus = (b.status || '').toUpperCase();
      if (bStatus === 'CANCELLED' || bStatus === 'FAILED') return false;

      const [bDate, bTime] = b.scheduledTime.split('T');
      const bTimeShort = bTime ? bTime.slice(0, 5) : '';
      return bDate === targetDate && bTimeShort === timeStr;
    }).length;

    let c = maxCapacity - bookedInList;
    if (typeof slotObj === 'object' && slotObj.availableCount !== undefined) {
      c = Math.min(slotObj.availableCount, c);
    }
    if (typeof slotObj === 'object' && (slotObj.available === false || slotObj.isAvailable === false)) {
      c = 0;
    }
    return Math.max(0, c);
  };

  // Fetch available slots when date or plate changes
  useEffect(() => {
    if (!open || !form.bookingDate) return;

    setLoadingSlots(true);
    bookingService.getAvailableSlots(form.bookingDate, form.plate)
      .then(slotsData => {
        let finalSlots = [];
        if (Array.isArray(slotsData) && slotsData.length > 0) {
          finalSlots = slotsData;
        } else {
          finalSlots = DEFAULT_SLOTS.map(t => ({ time: t, availableCount: 3, available: true }));
        }
        setSlotsList(finalSlots);

        // Auto select first available slot
        const firstAvail = finalSlots.find(s => {
          const tStr = typeof s === 'string' ? s : s.time;
          return getSlotCount(s, form.bookingDate) > 0;
        });
        const defaultTime = firstAvail
          ? (typeof firstAvail === 'string' ? firstAvail : firstAvail.time)
          : (finalSlots[0] ? (typeof finalSlots[0] === 'string' ? finalSlots[0] : finalSlots[0].time) : '');

        setForm(prev => ({
          ...prev,
          bookingTime: prev.bookingTime && getSlotCount(prev.bookingTime, form.bookingDate) > 0 ? prev.bookingTime : defaultTime
        }));
      })
      .catch(err => {
        console.error('Lỗi lấy danh sách slot:', err);
        const fallback = DEFAULT_SLOTS.map(t => ({ time: t, availableCount: 3, available: true }));
        setSlotsList(fallback);
        const firstAvail = fallback.find(s => getSlotCount(s, form.bookingDate) > 0);
        setForm(prev => ({ ...prev, bookingTime: firstAvail ? firstAvail.time : fallback[0].time }));
      })
      .finally(() => setLoadingSlots(false));
  }, [open, form.bookingDate, form.plate, existingBookings]);

  if (!open) return null;

  const selectedService = services.find(s => String(s.serviceId || s.id) === String(form.serviceId));
  const selectedPrice = selectedService?.price;
  const isPriceMissing = !!selectedService && !(Number(selectedPrice) > 0);
  const priceDisplayValue = !form.serviceId
    ? 'Chưa chọn dịch vụ'
    : isPriceMissing
      ? ''
      : formatCurrencyVN(selectedPrice);

  const handleReset = () => {
    const defaultTime = slotsList.length > 0
      ? (typeof slotsList[0] === 'string' ? slotsList[0] : slotsList[0].time)
      : '';

    setForm({
      customerName: '',
      phone: '',
      plate: '',
      serviceId: services.length > 0 ? String(services[0].serviceId || services[0].id) : '',
      bookingDate: getTodayDateStr(),
      bookingTime: defaultTime,
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '');
    } else if (name === 'plate') {
      formattedValue = value.toUpperCase();
    }

    setForm(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setError('');

    // 1. Validate Họ tên
    if (!form.customerName.trim()) {
      setError('Họ tên khách không được để trống.');
      return;
    }

    // 2. Validate SĐT (chuẩn SĐT Việt Nam)
    const phoneTrimmed = form.phone.trim();
    if (!phoneTrimmed) {
      setError('Số điện thoại không được để trống.');
      return;
    }
    if (!/^0[3|5|7|8|9][0-9]{8}$/.test(phoneTrimmed)) {
      setError('Số điện thoại không đúng chuẩn (gồm 10-11 chữ số).');
      return;
    }

    // 3. Validate Biển số xe (chuẩn biển số Việt Nam: Ví dụ 59A-12345, 30F-123.45)
    const plateTrimmed = form.plate.trim().toUpperCase();
    if (!plateTrimmed) {
      setError('Biển số xe không được để trống.');
      return;
    }
    const cleanedPlate = plateTrimmed.replace(/[^A-Z0-9]/g, '');
    if (!/^[0-9]{2}[A-Z0-9]{1,2}[0-9]{4,5}$/.test(cleanedPlate)) {
      setError('Biển số xe không nhập đúng chuẩn (Ví dụ hợp lệ: 59A-12345, 30F-123.45).');
      return;
    }

    // 4. Validate Dịch vụ
    if (!form.serviceId) {
      setError('Phải chọn dịch vụ.');
      return;
    }
    if (isPriceMissing) {
      setError('Dịch vụ này chưa được cấu hình đơn giá.');
      return;
    }

    // 5. Validate Ngày và Giờ
    if (!form.bookingDate) {
      setError('Phải chọn ngày đặt lịch.');
      return;
    }
    if (!form.bookingTime) {
      setError('Phải chọn giờ đặt lịch.');
      return;
    }

    // 6. Validate thời điểm đã qua
    const selectedDateTime = new Date(`${form.bookingDate}T${form.bookingTime}:00`);
    if (isNaN(selectedDateTime.getTime()) || selectedDateTime < new Date()) {
      setError('Không thể đặt lịch ở thời điểm đã qua.');
      return;
    }

    // 7. Validate Slot KÍN (Hết slot)
    const selectedSlotObj = slotsList.find(s => (typeof s === 'string' ? s : s.time) === form.bookingTime);
    const countRemaining = getSlotCount(selectedSlotObj || form.bookingTime, form.bookingDate);
    if (countRemaining === 0) {
      setError('Khung giờ này đã KÍN (hết slot). Vui lòng chọn khung giờ khác.');
      return;
    }

    // 8. Validate trùng lịch theo biển số xe + thời gian
    const isConflict = existingBookings.some(b => {
      if (!b.scheduledTime || !b.licensePlate) return false;
      const bStatus = (b.status || '').toUpperCase();
      if (bStatus === 'CANCELLED' || bStatus === 'FAILED') return false;

      const normPlate = (b.licensePlate || '').replace(/[^A-Z0-9]/g, '');
      const inputPlate = plateTrimmed.replace(/[^A-Z0-9]/g, '');
      if (normPlate !== inputPlate) return false;

      const [bDate, bTime] = b.scheduledTime.split('T');
      const bTimeShort = bTime ? bTime.slice(0, 5) : '';
      return bDate === form.bookingDate && bTimeShort === form.bookingTime;
    });

    if (isConflict) {
      setError('Xe mang biển số này đã có lịch hẹn tại thời điểm đã chọn.');
      return;
    }

    // Prepare Payload for Backend
    const payload = {
      customerName: form.customerName.trim(),
      phone: phoneTrimmed,
      plate: plateTrimmed,
      serviceId: Number(form.serviceId),
      bookingDate: form.bookingDate,
      bookingTime: form.bookingTime,
      isWalkIn: true,
    };

    setLoadingSubmit(true);
    try {
      await adminBookingService.createWalkIn(payload);
      setSuccessToast(true);
      handleReset();
      setTimeout(() => {
        setSuccessToast(false);
        onSuccess?.();
        onClose?.();
      }, 1500);
    } catch (err) {
      console.error('Lỗi tạo đơn khách vãng lai:', err);
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Không thể tạo đơn đặt lịch vãng lai. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="walkin-modal-overlay">
      <div className="walkin-modal-container">

        {/* Header */}
        <div className="walkin-modal-header">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-cyan-500"></span>
            <h2 className="walkin-modal-title">ĐẶT LỊCH KHÁCH VÃNG LAI</h2>
          </div>
          <button type="button" onClick={onClose} className="walkin-modal-close-btn">
            &times;
          </button>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="walkin-success-banner">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>Đặt lịch thành công!</span>
          </div>
        )}

        {/* Body */}
        <div className="walkin-modal-body">
          <form className="walkin-modal-form" onSubmit={(e) => e.preventDefault()}>

            {/* Họ tên khách */}
            <div className="walkin-form-group">
              <label className="walkin-label">
                Họ tên khách <span className="walkin-required">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                placeholder="Nhập họ tên khách hàng"
                value={form.customerName}
                onChange={handleChange}
                className="walkin-input"
                required
              />
            </div>

            {/* Số điện thoại */}
            <div className="walkin-form-group">
              <label className="walkin-label">
                Số điện thoại <span className="walkin-required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Ví dụ: 0901234567"
                value={form.phone}
                onChange={handleChange}
                className="walkin-input"
                maxLength={11}
                required
              />
            </div>

            {/* Biển số xe */}
            <div className="walkin-form-group">
              <label className="walkin-label">
                Biển số xe <span className="walkin-required">*</span>
              </label>
              <input
                type="text"
                name="plate"
                placeholder="Ví dụ: 59A-12345"
                value={form.plate}
                onChange={handleChange}
                className="walkin-input uppercase font-mono"
                required
              />
            </div>

            {/* Dịch vụ & Đơn giá */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="walkin-form-group">
                <label className="walkin-label">
                  Dịch vụ <span className="walkin-required">*</span>
                </label>
                <div className="walkin-select-wrapper">
                  <select
                    name="serviceId"
                    value={form.serviceId}
                    onChange={handleChange}
                    className="walkin-select"
                    required
                  >
                    <option value="">▼ Chọn dịch vụ</option>
                    {services.map(s => {
                      const sid = s.serviceId || s.id;
                      return (
                        <option key={sid} value={sid}>
                          {s.name || s.serviceName}
                        </option>
                      );
                    })}
                  </select>
                  <span className="material-symbols-outlined walkin-select-chevron">keyboard_arrow_down</span>
                </div>
              </div>

              <div className="walkin-form-group">
                <label className="walkin-label">
                  Đơn giá <span className="walkin-required">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={priceDisplayValue}
                  className="walkin-input walkin-input-readonly"
                />
                {isPriceMissing && (
                  <span className="walkin-price-warning">Dịch vụ này chưa được cấu hình đơn giá.</span>
                )}
              </div>
            </div>

            {/* Ngày & Giờ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="walkin-form-group">
                <label className="walkin-label">
                  Ngày <span className="walkin-required">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="bookingDate"
                    value={form.bookingDate}
                    onChange={handleChange}
                    className="walkin-input"
                    required
                  />
                </div>
              </div>

              <div className="walkin-form-group">
                <label className="walkin-label">
                  Giờ <span className="walkin-required">*</span>
                </label>
                <div className="walkin-select-wrapper">
                  <select
                    name="bookingTime"
                    value={form.bookingTime}
                    onChange={handleChange}
                    className="walkin-select"
                    disabled={loadingSlots}
                    required
                  >
                    {slotsList.map(slot => {
                      const timeStr = typeof slot === 'string' ? slot : slot.time;
                      const count = getSlotCount(slot, form.bookingDate);
                      const isFull = count === 0;
                      const displayLabel = isFull
                        ? `${timeStr} - KÍN (Hết slot)`
                        : `${timeStr} (• ${count} chỗ trống)`;
                      return (
                        <option
                          key={timeStr}
                          value={timeStr}
                          disabled={isFull}
                          className={isFull ? 'text-red-400 font-normal' : 'text-emerald-700 font-semibold'}
                        >
                          {displayLabel}
                        </option>
                      );
                    })}
                  </select>
                  <span className="material-symbols-outlined walkin-select-chevron">keyboard_arrow_down</span>
                </div>
              </div>
            </div>

            {/* Error message display */}
            {error && (
              <div className="walkin-error-alert">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="walkin-modal-actions">
              <button
                type="button"
                onClick={handleReset}
                disabled={loadingSubmit}
                className="walkin-btn reset"
              >
                Làm mới
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loadingSubmit}
                className="walkin-btn submit"
              >
                {loadingSubmit ? 'Đang xử lý...' : 'Đặt lịch ngay'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
