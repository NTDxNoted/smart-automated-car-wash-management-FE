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
  const { t } = useLanguage();
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

  const inputClass = `
    w-full bg-white border border-slate-300 rounded-lg px-4 py-3
    text-slate-800 placeholder-slate-400 text-sm
    focus:outline-none focus:border-cyan-500 focus:bg-white
    transition-all duration-200
  `;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 p-6 space-y-5"
        style={{
          background: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3
            className="text-lg font-bold text-slate-800 tracking-wide"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200" />

        {/* Error total */}
        {errorMsg && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2">
            <p className="text-red-400 text-sm" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {errorMsg}
            </p>
          </div>
        )}

        {/* Simple Input form */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-xs text-slate-500 uppercase tracking-widest mb-2"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              {t('licensePlateLabel')}
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={e => { setLicensePlate(e.target.value.toUpperCase()); setErrorMsg(''); }}
              placeholder={t('licensePlatePlaceholder')}
              className={inputClass}
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              maxLength={10}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-600 text-sm hover:border-slate-400 hover:text-slate-800 transition-all duration-200 disabled:opacity-50"
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              {t('btnCancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
              style={{
                fontFamily: "'Archivo', sans-serif",
                background: isLoading
                  ? 'rgba(6,182,212,0.4)'
                  : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow: isLoading ? 'none' : '0 0 16px rgba(6,182,212,0.35)',
              }}
            >
              {isLoading ? t('btnSaving') : t('btnConfirmModal')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

