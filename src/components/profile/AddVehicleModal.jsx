import { useState } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { useLanguage } from '../../context/LanguageContext';

/**
 * AddVehicleModal — Modal thêm xe mới hoặc sửa biển số (Bỏ qua bước OTP)
 *
 * Props:
 *   mode        : 'add' | 'edit'
 *   vehicle     : object | null  — vehicle object khi mode='edit'
 *   onSuccess   : (vehicle) => void
 *   onClose     : () => void
 */
export default function AddVehicleModal({ mode = 'add', vehicle = null, onSuccess, onClose }) {
  const { t, locale } = useLanguage();
  const [licensePlate, setLicensePlate] = useState(mode === 'edit' ? vehicle?.licensePlate ?? '' : '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isEdit = mode === 'edit';
  const title = isEdit ? t('modalEditVehicle') : t('modalAddVehicle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!licensePlate.trim()) {
      setErrorMsg(t('licensePlateRequired'));
      return;
    }

    setErrorMsg('');
    try {
      setIsLoading(true);
      let result;
      if (isEdit) {
        result = await vehicleService.updateVehicle(vehicle.id, { 
          licensePlate: licensePlate.trim().toUpperCase(), 
          otp: '123456' 
        });
      } else {
        result = await vehicleService.addVehicle({ 
          licensePlate: licensePlate.trim().toUpperCase(), 
          otp: '123456' 
        });
      }
      onSuccess(result);
    } catch (err) {
      const msg = err?.response?.data?.message ?? t('profileUpdateFailed');
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[28px] border border-white/40 relative overflow-hidden"
        style={{
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.92)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-28 h-28 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-xl font-bold">directions_car</span>
            </div>
            <h3
              className="text-lg font-black text-slate-800 uppercase tracking-tight"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 flex items-start gap-2.5" style={{ marginBottom: '20px' }}>
            <span className="material-symbols-outlined text-red-500 text-lg shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              error
            </span>
            <p className="text-red-500 text-xs font-semibold" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {errorMsg}
            </p>
          </div>
        )}

        {/* Form Fields */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <label
              className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1"
              style={{ fontFamily: "'Archivo', sans-serif", marginBottom: '8px', display: 'block' }}
            >
              {t('licensePlateLabel')}
            </label>
            
            <div className="group flex items-center gap-3 rounded-2xl border-2 border-slate-200/80 bg-slate-50/50 px-4 py-3.5 transition-all duration-300 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-sm" style={{ marginBottom: '8px' }}>
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-cyan-500 transition-colors shrink-0 text-xl">
                badge
              </span>
              <input
                type="text"
                value={licensePlate}
                onChange={e => { setLicensePlate(e.target.value.toUpperCase()); setErrorMsg(''); }}
                placeholder={t('licensePlatePlaceholder')}
                className="w-full bg-transparent text-base font-bold text-slate-850 outline-none placeholder:text-slate-400 uppercase tracking-wide"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                maxLength={10}
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            <p className="text-[11px] text-slate-400 font-medium px-1">
              {locale === 'en' ? 'Format: 51A-12345 or 51A-123.45' : 'Định dạng gợi ý: 51A-12345 hoặc 51A-123.45'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-300 font-bold text-sm transition-all duration-300 cursor-pointer text-center disabled:opacity-50"
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              {t('btnCancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-grow-[1.5] py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
              style={{
                fontFamily: "'Archivo', sans-serif",
                background: isLoading
                  ? 'rgba(6,182,212,0.5)'
                  : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow: isLoading ? 'none' : '0 10px 15px -3px rgba(6,182,212,0.3)',
              }}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>{t('btnSaving')}</span>
                </>
              ) : (
                <>
                  <span>{t('btnConfirmModal')}</span>
                  <span className="material-symbols-outlined text-base">check</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
