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
    const tStr = String(tier !== undefined && tier !== null ? tier : '').trim().toUpperCase();
    if (tStr === '4' || tStr === 'PLATINUM' || tStr === 'DIAMOND') return 14;
    if (tStr === '3' || tStr === 'GOLD') return 12;
    if (tStr === '2' || tStr === 'SILVER') return 10;
    return 7;
  };

  const getTierName = (tier) => {
    const tStr = String(tier !== undefined && tier !== null ? tier : '').trim().toUpperCase();
    if (tStr === '4' || tStr === 'PLATINUM') return 'Platinum';
    if (tStr === '3' || tStr === 'GOLD') return 'Gold';
    if (tStr === '2' || tStr === 'SILVER') return 'Silver';
    return 'Member';
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
        } else if (allowed.length > 0) {
          setSelectedDate(allowed[0].dateStr);
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
      <h2 className="mb-6 text-xl font-bold text-slate-800 flex items-center gap-2">
        <span className="w-2.5 h-6 rounded-full bg-cyan-500"></span>
        {t('step2Title') || 'Bước 2: Thông tin xe và Thời gian đặt lịch'}
      </h2>

      {/* Phone + Vehicle */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {user ? (
          <>
            {/* Phone (disabled) */}
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700 tracking-wide">{t('phoneLabel')}</span>
              <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3.5 cursor-not-allowed">
                <span className="material-symbols-outlined text-slate-400 text-xl">call</span>
                <input
                  type="text"
                  value={bookingData.phone}
                  disabled
                  className="w-full bg-transparent text-base font-semibold text-slate-500 cursor-not-allowed outline-none"
                />
              </span>
            </label>

            {/* Vehicle select */}
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700 tracking-wide">{t('selectVehicleLabel')}</span>
              {vehicles.length > 0 ? (
                <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3.5 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300 text-xl">directions_car</span>
                  <select
                    value={bookingData.selectedVehicleId}
                    onChange={e => handleVehicleChange(e.target.value)}
                    className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id} className="bg-white">
                        {v.model} ({v.licensePlate})
                      </option>
                    ))}
                  </select>
                </span>
              ) : (
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
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
              <span className="mb-2 block text-sm font-bold text-slate-700 tracking-wide">{t('phoneLabel')}</span>
              <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3.5 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-md transition-all duration-300">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300 text-xl">call</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={bookingData.phone}
                  onChange={e => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={t('phonePlaceholder')}
                  className="w-full bg-transparent text-base font-semibold text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </span>
              {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-xs">error</span>{errors.phone}</p>}
            </label>

            {/* License plate input */}
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700 tracking-wide">{t('licensePlateLabel')}</span>
              <span className="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3.5 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-md transition-all duration-300">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300 text-xl">directions_car</span>
                <input
                  type="text"
                  value={bookingData.licensePlate}
                  onChange={e => setBookingData(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                  placeholder={t('licensePlatePlaceholder')}
                  className="w-full bg-transparent text-base font-semibold uppercase text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </span>
              {errors.licensePlate && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-xs">error</span>{errors.licensePlate}</p>}
            </label>
          </>
        )}
      </div>

      {/* Date + Time grid */}
      <div className="mt-10">
        <p className="mb-4 text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
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
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {availableDays.map(day => {
              const isSelected = selectedDate === day.dateStr;
              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => { setSelectedDate(day.dateStr); setSelectedTime(''); }}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all duration-200 cursor-pointer ${
                    isSelected
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
        <div className="mt-10">
          <p className="mb-4 text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 bg-cyan-500 rounded-full"></span>
            {t('timeSlotsInDay')}{' '}
            {selectedDate ? (
              <span className="text-cyan-600 font-sans ml-1 text-xs lowercase font-semibold">({selectedDate})</span>
            ) : (
              <span className="text-amber-500 italic font-normal ml-1 text-xs lowercase">({t('selectDatePrompt')})</span>
            )}
          </p>

          {selectedDate && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {activeDaySlots.map((slot, idx) => {
                const isUnavailable = !slot.isAvailable;
                const isTimeSelected = selectedTime === slot.time;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => handleSelectSlot(selectedDate, slot.time)}
                    className={`rounded-xl border-2 py-3 px-4 text-sm font-bold font-sans transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      isUnavailable
                        ? 'cursor-not-allowed border-slate-100/50 bg-slate-100/70 text-slate-300 line-through decoration-slate-200 opacity-60'
                        : isTimeSelected
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700 font-extrabold shadow-sm shadow-cyan-100 hover:scale-[1.02]'
                        : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/20 hover:text-cyan-600 hover:scale-[1.02]'
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

      <div className="flex justify-between items-center mt-8 py-[5px] border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 px-10 py-3.5 text-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {t('btnBack')}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 px-12 py-3.5 text-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
        >
          {t('btnContinue')}
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}