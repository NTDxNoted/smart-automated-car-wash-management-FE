import React, { useState } from 'react';
import OtpVerifyStep from './OtpVerifyStep';
import { vehicleService } from '../../services/vehicleService';

/**
 * AddVehicleModal — Modal thêm xe mới hoặc sửa biển số (BR-10: OTP 2 bước)
 *
 * Props:
 *   mode        : 'add' | 'edit'
 *   vehicle     : object | null  — vehicle object khi mode='edit'
 *   onSuccess   : (vehicle) => void
 *   onClose     : () => void
 */
export default function AddVehicleModal({ mode = 'add', vehicle = null, onSuccess, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Sửa biển số xe' : 'Thêm xe mới';

  const handleConfirm = async ({ licensePlate, otp }) => {
    setErrorMsg('');
    try {
      setIsLoading(true);
      let result;
      if (isEdit) {
        result = await vehicleService.updateVehicle(vehicle.id, { licensePlate, otp });
      } else {
        result = await vehicleService.addVehicle({ licensePlate, otp });
      }
      onSuccess(result);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Đã có lỗi xảy ra, thử lại sau';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div
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
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200" />

        {/* Error toàn modal (từ API) */}
        {errorMsg && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2">
            <p className="text-red-400 text-sm" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {errorMsg}
            </p>
          </div>
        )}

        {/* OTP Flow */}
        <OtpVerifyStep
          initialPlate={isEdit ? vehicle?.licensePlate ?? '' : ''}
          onConfirm={handleConfirm}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
