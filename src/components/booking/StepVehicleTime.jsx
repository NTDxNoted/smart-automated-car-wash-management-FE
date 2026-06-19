import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { useLanguage } from '../../context/LanguageContext';

export default function StepVehicleTime({ bookingData, setBookingData, onNext, onBack, user }) {
  const { t, locale } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(true);

  const getBookingWindowDays = (tier) => {
    switch (tier?.toUpperCase()) {
      case 'DIAMOND': return 30;
      case 'GOLD':    return 15;
      case 'SILVER':  return 10;
      default:        return 7;
    }
  };

  const bookingWindowDays = getBookingWindowDays(user?.tier);

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
          }
        })
        .catch(err => console.error('Lỗi fetch xe:', err));
    }

    const todayStr = new Date().toISOString().split('T')[0];
    setLoadingSlots(true);
    bookingService.getAvailableSlots(todayStr)
      .then(data => {
        const daysOfWeek = locale === 'en'
          ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const allowed = data.slice(0, bookingWindowDays).map(item => {
          const dateValStr = item.date || item.Date || item.dateStr;
          const d = new Date(dateValStr);
          return {
            dateStr: dateValStr,
            label: String(d.getDate()).padStart(2, '0'),
            dayOfWeek: daysOfWeek[d.getDay()],
            slots: item.slots || item.Slots || [],
          };
        });
        setAvailableDays(allowed);
        setLoadingSlots(false);

        if (bookingData.scheduledTime && bookingData.scheduledTime.includes('T')) {
          const [savedDate, savedTime] = bookingData.scheduledTime.split('T');
          setSelectedDate(savedDate);
          setSelectedTime(savedTime);
        }
      })
      .catch(err => {
        console.error('Lỗi fetch slot giờ trống:', err);
        setLoadingSlots(false);
      });
  }, [user, bookingWindowDays, locale]);

  const handleSelectSlot = (dateStr, timeStr) => {
    setSelectedDate(dateStr);
    setSelectedTime(timeStr);
    setBookingData(prev => ({ ...prev, scheduledTime: `${dateStr}T${timeStr}` }));
  };

  const handleVehicleChange = (vehicleId) => {
    const selected = vehicles.find(v => v.id === vehicleId);
    setBookingData(prev => ({
      ...prev,
      selectedVehicleId: vehicleId,
      licensePlate: selected ? selected.licensePlate : '',
    }));
  };

  const validate = () => {
    const errs = {};
    if (!bookingData.phone.trim())       errs.phone = t('phoneRequired');
    if (!bookingData.licensePlate.trim()) errs.licensePlate = t('licensePlateRequired');
    if (!selectedDate || !selectedTime)   errs.scheduledTime = t('selectSlotRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const activeDaySlots = availableDays.find(d => d.dateStr === selectedDate)?.slots || [];

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-cyan-700">
        {t('step2Title') || 'Bước 2: Thông tin xe và Thời gian đặt lịch'}
      </h2>

      {/* Phone + Vehicle */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {user ? (
          <>
            {/* Phone (disabled) */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">{t('phoneLabel')}</span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">call</span>
                <input
                  type="text"
                  value={bookingData.phone}
                  disabled
                  className="w-full bg-transparent text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </span>
            </label>

            {/* Vehicle select */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">{t('selectVehicleLabel')}</span>
              {vehicles.length > 0 ? (
                <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-cyan-500 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">directions_car</span>
                  <select
                    value={bookingData.selectedVehicleId}
                    onChange={e => handleVehicleChange(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id} className="bg-white">
                        {v.model} ({v.licensePlate})
                      </option>
                    ))}
                  </select>
                </span>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  ⚠️ {t('profileNoVehicles') || 'Chưa có xe nào được đăng ký.'} 
                  <a href="/profile" className="ml-2 font-bold underline hover:text-amber-950">
                    {t('btnAddVehicle') || 'Thêm xe mới'}
                  </a>
                </div>
              )}
            </label>
          </>
        ) : (
          <>
            {/* Phone input */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">{t('phoneLabel')}</span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-cyan-500 transition-colors">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">call</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={bookingData.phone}
                  onChange={e => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={t('phonePlaceholder')}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </span>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </label>

            {/* License plate input */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">{t('licensePlateLabel')}</span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-cyan-500 transition-colors">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">directions_car</span>
                <input
                  type="text"
                  value={bookingData.licensePlate}
                  onChange={e => setBookingData(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                  placeholder={t('licensePlatePlaceholder')}
                  className="w-full bg-transparent text-sm uppercase text-slate-800 outline-none placeholder:text-slate-400"
                />
              </span>
              {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>}
            </label>
          </>
        )}
      </div>

      {/* Date + Time grid */}
      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold text-slate-700">
          {t('timeSlotsLabel')}{' '}
          <span className="font-normal text-cyan-600">
            ({t('maxBookingDays').replace('{days}', bookingWindowDays).replace('{tier}', user?.tier || 'GUEST')})
          </span>
        </p>

        {loadingSlots ? (
          <div className="text-center py-6 text-sm text-slate-400">
            <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>
            {t('loadingSlots')}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {availableDays.map(day => {
              const isSelected = selectedDate === day.dateStr;
              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => { setSelectedDate(day.dateStr); setSelectedTime(''); }}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 px-2 py-2 transition-colors ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-cyan-400'
                  }`}
                >
                  <span className={`text-[11px] font-semibold uppercase tracking-wider mb-0.5 ${isSelected ? 'text-cyan-50' : 'text-slate-400'}`}>
                    {day.dayOfWeek}
                  </span>
                  <span className="text-lg font-bold font-mono leading-none">{day.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Time slots */}
      {!loadingSlots && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            {t('timeSlotsInDay')}{' '}
            {selectedDate
              ? <span className="font-bold text-cyan-600 font-mono ml-1">{selectedDate}</span>
              : <span className="text-amber-500 italic font-normal ml-1">{t('selectDatePrompt')}</span>
            }
          </p>

          {selectedDate && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {activeDaySlots.map((slot, idx) => {
                const isUnavailable = !slot.isAvailable;
                const isTimeSelected = selectedTime === slot.time;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => handleSelectSlot(selectedDate, slot.time)}
                    className={`rounded-lg border-2 px-2 py-2.5 text-sm font-semibold font-mono transition-colors ${
                      isUnavailable
                        ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400 line-through'
                        : isTimeSelected
                        ? 'border-cyan-500 bg-cyan-500 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-cyan-400'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}

          {errors.scheduledTime && (
            <p className="text-red-500 text-xs mt-2">{errors.scheduledTime}</p>
          )}
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-2.5 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          {t('btnBack')}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm font-semibold px-6 py-2.5 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          {t('btnContinue')}
        </button>
      </div>
    </section>
  );
}