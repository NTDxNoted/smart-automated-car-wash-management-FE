import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { profileService, getTierDisplayName } from '../../services/profileService';
import { useLanguage } from '../../context/LanguageContext';
import TimeSlotGrid from './TimeSlotGrid';

export default function StepVehicleTime({ bookingData, setBookingData, onNext, onBack, user }) {
  const { t, locale } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [isValidatingPlate, setIsValidatingPlate] = useState(false);

  const getBookingWindowDays = (tier) => {
    const tStr = String(tier !== undefined && tier !== null ? tier : '').trim().toUpperCase();
    if (tStr === '4' || tStr === 'PLATINUM' || tStr === 'DIAMOND') return 14;
    if (tStr === '3' || tStr === 'GOLD') return 12;
    if (tStr === '2' || tStr === 'SILVER') return 10;
    return 7;
  };

  const getTierName = (tier) => getTierDisplayName(tier);

  const bookingWindowDays = getBookingWindowDays(user?.tier);

  // ── Validation Helpers ───────────────────────────────────────────────────
  const validatePhone = (phoneStr) => {
    if (!phoneStr || !phoneStr.trim()) {
      return t('phoneRequired') || 'Vui lòng nhập số điện thoại liên hệ';
    }
    const cleanPhone = phoneStr.trim().replace(/\s/g, '');
    if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
      return 'Số điện thoại không đúng định dạng (phải bắt đầu bằng 03, 05, 07, 08, 09 và gồm 10 chữ số)';
    }
    return null;
  };

  const validatePlateFormat = (plate) => {
    if (!plate || !plate.trim()) {
      return t('licensePlateRequired') || 'Vui lòng nhập hoặc chọn biển số xe';
    }
    const cleanPlate = plate.trim().toUpperCase();
    if (cleanPlate.length < 6 || cleanPlate.length > 12) {
      return 'Biển số xe không đạt yêu cầu (độ dài phải từ 6 - 12 ký tự, VD: 51L-007.10)';
    }
    if (!/^[0-9A-Z.\-\s]+$/.test(cleanPlate)) {
      return 'Biển số xe không hợp lệ. Chỉ chấp nhận chữ cái, chữ số, dấu gạch ngang và dấu chấm.';
    }
    return null;
  };

  const checkPlateAvailability = async (plate) => {
    if (!plate || !plate.trim()) return false;

    const formatErr = validatePlateFormat(plate);
    if (formatErr) {
      setErrors(prev => ({ ...prev, licensePlate: formatErr }));
      return false;
    }

    setIsValidatingPlate(true);
    try {
      const res = await bookingService.validatePlate(plate.trim());
      if (!res.isAvailable) {
        const errMsg = res.message || 'Biển số xe này hiện bị khóa hoặc đang có đơn rửa xe chờ xử lý.';
        setErrors(prev => ({ ...prev, licensePlate: errMsg }));
        setIsValidatingPlate(false);
        return false;
      }
      setErrors(prev => ({ ...prev, licensePlate: null }));
      setIsValidatingPlate(false);
      return true;
    } catch (err) {
      const serverCode = err?.response?.data?.error || err?.response?.data?.code;
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      let msg = serverMsg || 'Biển số xe không đạt yêu cầu hoặc đang trong thời gian chờ.';
      if (serverCode === 'VEHICLE_BUFFER_VIOLATION' || serverCode === 'LICENSE_PLATE_LOCKED') {
        msg = 'Biển số xe này đang có lịch hẹn chờ rửa trong vòng 2 tiếng. Vui lòng chọn biển số khác hoặc kiểm tra lại.';
      } else if (serverCode === 'LICENSE_PLATE_COOLDOWN') {
        msg = 'Biển số xe này vừa mới hoàn thành rửa xe trong 1 giờ. Vui lòng chọn giờ hẹn sau 1 tiếng.';
      } else if (serverCode === 'BOOKING_COOLDOWN_ACTIVE' || serverCode === 'BOOKING_SUSPENDED') {
        msg = 'Tài khoản / Biển số xe tạm thời bị khóa đặt lịch do hủy đơn 3 lần liên tiếp.';
      }
      setErrors(prev => ({ ...prev, licensePlate: msg }));
      setIsValidatingPlate(false);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      bookingService.getVehicles()
        .then(data => {
          setVehicles(data);
          if (data.length > 0 && !bookingData.selectedVehicleId) {
            setBookingData(prev => ({
              ...prev,
              selectedVehicleId: data[0].id,
              licensePlate: data[0].licensePlate,
            }));
            if (data[0].licensePlate) {
              checkPlateAvailability(data[0].licensePlate);
            }
          }
        })
        .catch(err => console.error('Lỗi fetch xe:', err));
    }
  }, [user]);

  useEffect(() => {
    const days = [];
    const daysOfWeek = locale === 'en'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < bookingWindowDays; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateVal = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateVal}`;

      days.push({
        dateStr,
        label: dateVal,
        dayOfWeek: daysOfWeek[d.getDay()],
        slots: []
      });
    }
    setAvailableDays(days);

    if (bookingData.scheduledTime && bookingData.scheduledTime.includes('T')) {
      const [savedDate, savedTime] = bookingData.scheduledTime.split('T');
      setSelectedDate(savedDate);
      setSelectedTime(savedTime);
    } else if (days.length > 0) {
      setSelectedDate(days[0].dateStr);
    }
  }, [bookingWindowDays, locale]);

  useEffect(() => {
    if (!selectedDate) return;

    setLoadingSlots(true);
    bookingService.getAvailableSlots(selectedDate, bookingData.licensePlate)
      .then(slotsData => {
        setAvailableDays(prevDays => {
          return prevDays.map(day => {
            if (day.dateStr === selectedDate) {
              return {
                ...day,
                slots: slotsData || [],
              };
            }
            return day;
          });
        });
        setLoadingSlots(false);

        if (selectedTime) {
          const matchingSlot = slotsData.find(s => s.time === selectedTime);
          const isStillAvailable = matchingSlot && matchingSlot.availableCount > 0;

          const isSlotViolatingAdvanceRule = (timeStr) => {
            if (!timeStr || !selectedDate) return false;
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const dateVal = String(d.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${dateVal}`;

            if (selectedDate !== todayStr) return false;

            const now = new Date();
            const [y, m, dayVal] = selectedDate.split('-').map(Number);
            const [hours, minutes] = timeStr.split(':').map(Number);

            const slotDate = new Date(y, m - 1, dayVal, hours, minutes, 0);
            const diffMins = (slotDate.getTime() - now.getTime()) / (1000 * 60);

            return diffMins < 60;
          };

          const violatesRule = isSlotViolatingAdvanceRule(selectedTime);

          if (!isStillAvailable || violatesRule) {
            setSelectedTime('');
            setBookingData(prev => ({ ...prev, scheduledTime: '' }));
          }
        }
      })
      .catch(err => {
        console.error('Lỗi fetch slot giờ trống:', err);
        setLoadingSlots(false);
      });
  }, [selectedDate, bookingData.licensePlate, bookingData.service?.id]);

  const handleSelectSlot = (dateStr, timeStr) => {
    setSelectedDate(dateStr);
    setSelectedTime(timeStr);
    setBookingData(prev => ({ ...prev, scheduledTime: `${dateStr}T${timeStr}` }));
  };

  const handleVehicleChange = (vehicleId) => {
    setErrors(prev => ({ ...prev, licensePlate: null }));
    if (vehicleId === 'new') {
      setBookingData(prev => ({
        ...prev,
        selectedVehicleId: 'new',
        licensePlate: '',
      }));
    } else {
      const selected = vehicles.find(v => v.id === vehicleId);
      const plateVal = selected ? selected.licensePlate : '';
      setBookingData(prev => ({
        ...prev,
        selectedVehicleId: vehicleId,
        licensePlate: plateVal,
      }));
      if (plateVal) {
        checkPlateAvailability(plateVal);
      }
    }
  };

  const handleNext = async () => {
    const errs = {};

    const phoneErr = validatePhone(bookingData.phone);
    if (phoneErr) {
      errs.phone = phoneErr;
    }

    const plateFormatErr = validatePlateFormat(bookingData.licensePlate);
    if (plateFormatErr) {
      errs.licensePlate = plateFormatErr;
    }

    if (!selectedDate || !selectedTime) {
      errs.scheduledTime = t('selectSlotRequired') || 'Vui lòng chọn ngày và khung giờ rửa xe';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Validate license plate availability against backend buffer rules
    const isPlateValid = await checkPlateAvailability(bookingData.licensePlate);
    if (!isPlateValid) return;

    onNext();
  };

  const activeDaySlots = availableDays.find(d => d.dateStr === selectedDate)?.slots || [];

  return (
    <section>
      <h2
        className="text-xl font-bold text-slate-800 flex items-center gap-2"
        style={{ marginBottom: '24px' }}
      >
        <span className="w-2.5 h-6 rounded-full bg-cyan-500"></span>
        {t('step2Title') || 'Bước 2: Thông tin xe và Thời gian đặt lịch'}
      </h2>

      {/* Phone + Vehicle */}
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        style={{ gap: '24px', marginBottom: '32px' }}
      >
        {user ? (
          <>
            {/* Phone (Editable) */}
            <label className="block">
              <span
                className="block text-sm font-bold text-slate-700 tracking-wide"
                style={{ marginBottom: '8px' }}
              >
                {t('phoneLabel')}
              </span>
              <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3.5 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-md transition-all duration-300">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300 text-xl">call</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={bookingData.phone}
                  onChange={e => {
                    setBookingData(prev => ({ ...prev, phone: e.target.value }));
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                  }}
                  onBlur={() => {
                    const phoneErr = validatePhone(bookingData.phone);
                    if (phoneErr) setErrors(prev => ({ ...prev, phone: phoneErr }));
                  }}
                  placeholder={t('phonePlaceholder')}
                  className="w-full bg-transparent text-base font-semibold text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </span>
              {errors.phone && (
                <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-base shrink-0 text-red-500">error</span>
                  <span>{errors.phone}</span>
                </div>
              )}
            </label>

            {/* Vehicle Mode Toggle Tab (Chọn xe đã lưu / Nhập biển số mới) */}
            <div className="block">
              <span
                className="block text-sm font-bold text-slate-700 tracking-wide"
                style={{ marginBottom: '8px' }}
              >
                Phương thức chọn xe
              </span>
              <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setErrors(prev => ({ ...prev, licensePlate: null }));
                    if (vehicles.length > 0) {
                      setBookingData(prev => ({
                        ...prev,
                        selectedVehicleId: vehicles[0].id,
                        licensePlate: vehicles[0].licensePlate
                      }));
                      if (vehicles[0].licensePlate) {
                        checkPlateAvailability(vehicles[0].licensePlate);
                      }
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    bookingData.selectedVehicleId !== 'new' && bookingData.selectedVehicleId !== null
                      ? 'bg-white text-cyan-600 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🚗</span>
                  <span>Chọn xe đã lưu</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrors(prev => ({ ...prev, licensePlate: null }));
                    setBookingData(prev => ({
                      ...prev,
                      selectedVehicleId: 'new',
                      licensePlate: ''
                    }));
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    bookingData.selectedVehicleId === 'new'
                      ? 'bg-white text-cyan-600 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>✏️</span>
                  <span>Nhập biển số mới</span>
                </button>
              </div>
            </div>

            {/* If 'Chọn xe đã lưu' active: Dropdown */}
            {bookingData.selectedVehicleId !== 'new' && vehicles.length > 0 && (
              <label className="block sm:col-span-2">
                <span
                  className="block text-sm font-bold text-slate-700 tracking-wide"
                  style={{ marginBottom: '8px' }}
                >
                  {t('selectVehicleLabel') || 'Chọn Xe Của Bạn'}
                </span>
                <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3.5 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300 text-xl">directions_car</span>
                  <select
                    value={bookingData.selectedVehicleId}
                    onChange={e => handleVehicleChange(e.target.value)}
                    className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id} className="bg-white">
                        {v.model ? `${v.model} (${v.licensePlate})` : v.licensePlate}
                      </option>
                    ))}
                  </select>
                </span>
                {errors.licensePlate && (
                  <div className="mt-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200 shadow-xs">
                    <span className="material-symbols-outlined text-base shrink-0 text-rose-500 mt-0.5">error</span>
                    <div className="flex-1 leading-relaxed">
                      <strong className="block font-bold text-rose-800 mb-0.5">Biển số xe không đạt yêu cầu / Bị khóa:</strong>
                      <span>{errors.licensePlate}</span>
                    </div>
                  </div>
                )}
              </label>
            )}

            {/* If 'Nhập biển số mới' active OR no saved vehicles: Input text box */}
            {(bookingData.selectedVehicleId === 'new' || vehicles.length === 0) && (
              <label className="block sm:col-span-2">
                <span
                  className="block text-sm font-bold text-slate-700 tracking-wide"
                  style={{ marginBottom: '8px' }}
                >
                  {t('licensePlateLabel') || 'Biển số xe mới'}
                </span>
                <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3.5 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300 text-xl">badge</span>
                  <input
                    type="text"
                    value={bookingData.licensePlate}
                    onChange={e => {
                      const val = e.target.value.toUpperCase();
                      setBookingData(prev => ({ ...prev, licensePlate: val }));
                      if (errors.licensePlate) setErrors(prev => ({ ...prev, licensePlate: null }));
                    }}
                    onBlur={() => {
                      if (bookingData.licensePlate) {
                        checkPlateAvailability(bookingData.licensePlate);
                      }
                    }}
                    placeholder={t('licensePlatePlaceholder') || 'VD: 30F-123.45 hoặc 51F12345'}
                    className="w-full bg-transparent text-base font-semibold uppercase text-slate-800 placeholder:text-slate-400 outline-none"
                  />
                  {isValidatingPlate && (
                    <span className="material-symbols-outlined animate-spin text-cyan-600 text-sm">progress_activity</span>
                  )}
                </span>
                {errors.licensePlate && (
                  <div className="mt-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200 shadow-xs">
                    <span className="material-symbols-outlined text-base shrink-0 text-rose-500 mt-0.5">error</span>
                    <div className="flex-1 leading-relaxed">
                      <strong className="block font-bold text-rose-800 mb-0.5">Biển số xe không đạt yêu cầu / Bị khóa:</strong>
                      <span>{errors.licensePlate}</span>
                    </div>
                  </div>
                )}
              </label>
            )}
          </>
        ) : (
          <>
            {/* Phone input */}
            <label className="block">
              <span
                className="block text-sm font-bold text-slate-700 tracking-wide"
                style={{ marginBottom: '8px' }}
              >
                {t('phoneLabel')}
              </span>
              <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3.5 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-md transition-all duration-300">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300 text-xl">call</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={bookingData.phone}
                  onChange={e => {
                    setBookingData(prev => ({ ...prev, phone: e.target.value }));
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                  }}
                  onBlur={() => {
                    const phoneErr = validatePhone(bookingData.phone);
                    if (phoneErr) setErrors(prev => ({ ...prev, phone: phoneErr }));
                  }}
                  placeholder={t('phonePlaceholder')}
                  className="w-full bg-transparent text-base font-semibold text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </span>
              {errors.phone && (
                <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-base shrink-0 text-red-500">error</span>
                  <span>{errors.phone}</span>
                </div>
              )}
            </label>

            {/* License plate input */}
            <label className="block">
              <span
                className="block text-sm font-bold text-slate-700 tracking-wide"
                style={{ marginBottom: '8px' }}
              >
                {t('licensePlateLabel')}
              </span>
              <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3.5 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-md transition-all duration-300">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300 text-xl">directions_car</span>
                <input
                  type="text"
                  value={bookingData.licensePlate}
                  onChange={e => {
                    const val = e.target.value.toUpperCase();
                    setBookingData(prev => ({ ...prev, licensePlate: val }));
                    if (errors.licensePlate) setErrors(prev => ({ ...prev, licensePlate: null }));
                  }}
                  onBlur={() => {
                    if (bookingData.licensePlate) {
                      checkPlateAvailability(bookingData.licensePlate);
                    }
                  }}
                  placeholder={t('licensePlatePlaceholder')}
                  className="w-full bg-transparent text-base font-semibold uppercase text-slate-800 placeholder:text-slate-400 outline-none"
                />
                {isValidatingPlate && (
                  <span className="material-symbols-outlined animate-spin text-cyan-600 text-sm">progress_activity</span>
                )}
              </span>
              {errors.licensePlate && (
                <div className="mt-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200 shadow-xs">
                  <span className="material-symbols-outlined text-base shrink-0 text-rose-500 mt-0.5">error</span>
                  <div className="flex-1 leading-relaxed">
                    <strong className="block font-bold text-rose-800 mb-0.5">Biển số xe không đạt yêu cầu / Bị khóa:</strong>
                    <span>{errors.licensePlate}</span>
                  </div>
                </div>
              )}
            </label>
          </>
        )}
      </div>

      {/* Date + Time grid */}
      <div style={{ marginBottom: '32px' }}>
        <p
          className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"
          style={{ marginBottom: '16px' }}
        >
          <span className="w-1.5 h-3 bg-cyan-500 rounded-full"></span>
          {t('timeSlotsLabel')}{' '}
          <span className="font-normal text-xs text-cyan-600 lowercase tracking-normal">
            ({t('maxBookingDays').replace('{days}', bookingWindowDays).replace('{tier}', getTierName(user?.tier))})
          </span>
        </p>

        {loadingSlots ? (
          <div className="text-center py-6 text-sm text-slate-400">
            <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>
            {t('loadingSlots')}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7" style={{ gap: '12px' }}>
            {availableDays.map(day => {
              const isSelected = selectedDate === day.dateStr;
              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => { setSelectedDate(day.dateStr); setSelectedTime(''); }}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all duration-200 cursor-pointer ${isSelected
                    ? 'border-cyan-500 bg-cyan-50/50 text-cyan-700 shadow-md shadow-cyan-100/50 scale-[1.03] ring-2 ring-cyan-200/30'
                    : 'border-slate-100 bg-white text-slate-800 hover:border-cyan-400 hover:bg-slate-50/50 hover:-translate-y-0.5 shadow-xs'
                    }`}
                >
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider mb-1 transition-colors duration-200 ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`}>
                    {day.dayOfWeek}
                  </span>
                  <span className={`text-lg font-black font-sans leading-none transition-colors duration-200 ${isSelected ? 'text-cyan-700' : 'text-slate-800'}`}>{day.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Time slots */}
      {!loadingSlots && (
        <div style={{ marginBottom: '32px' }}>
          <p
            className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"
            style={{ marginBottom: '16px' }}
          >
            <span className="w-1.5 h-3 bg-cyan-500 rounded-full"></span>
            {t('timeSlotsInDay')}{' '}
            {selectedDate ? (
              <span className="text-cyan-600 font-sans ml-1 text-xs lowercase font-semibold">({selectedDate})</span>
            ) : (
              <span className="text-amber-500 italic font-normal ml-1 text-xs lowercase">({t('selectDatePrompt')})</span>
            )}
          </p>

          {selectedDate && (
            <TimeSlotGrid
              slots={activeDaySlots}
              selectedTime={selectedTime}
              onSelectSlot={(time) => handleSelectSlot(selectedDate, time)}
              dateStr={selectedDate}
            />
          )}

          {errors.scheduledTime && (
            <p className="text-red-500 text-xs mt-2">{errors.scheduledTime}</p>
          )}
        </div>
      )}

      <div
        className="flex justify-between items-center border-t border-slate-100"
        style={{ marginTop: '40px', paddingTop: '24px' }}
      >
        <button
          type="button"
          onClick={onBack}
          className="rounded-full font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 px-10 py-3.5 text-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          style={{ paddingLeft: '24px', paddingRight: '24px' }}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {t('btnBack')}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 px-12 py-3.5 text-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          style={{ paddingLeft: '28px', paddingRight: '28px' }}
        >
          {t('btnContinue')}
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}