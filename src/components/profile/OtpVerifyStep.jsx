import React, { useState, useRef } from 'react';
import { vehicleService } from '../../services/vehicleService';

/**
 * OtpVerifyStep — BR-10: Flow OTP 2 bước cho thêm/sửa biển số
 *
 * Bước 1: Nhập biển số → bấm "Gửi OTP"
 * Bước 2: Nhập 6 số OTP → bấm "Xác nhận"
 *
 * Props:
 *   initialPlate : string  — biển số khởi tạo (để trống nếu thêm mới, có giá trị nếu sửa)
 *   onConfirm    : ({ licensePlate, otp }) => void — callback khi xác nhận thành công
 *   onCancel     : () => void
 *   isLoading    : bool    — loading state do parent quản lý (khi submit cuối)
 */
export default function OtpVerifyStep({ initialPlate = '', onConfirm, onCancel, isLoading = false }) {
  const [step, setStep] = useState(1); // 1 | 2
  const [plate, setPlate] = useState(initialPlate);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0); // giây đếm ngược resend
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  // ── Bước 1: gửi OTP ────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    setError('');
    if (!plate.trim()) {
      setError('Vui lòng nhập biển số xe');
      return;
    }
    try {
      setSendingOtp(true);
      await vehicleService.requestOtp({ licensePlate: plate.trim() });
      setStep(2);
      // Countdown 60s để cho phép resend
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Không thể gửi OTP, thử lại sau';
      setError(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  // ── Bước 2: xử lý nhập từng ô OTP ─────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // chỉ nhận số
    const next = [...otp];
    next[index] = value.slice(-1); // chỉ lấy 1 ký tự
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Xác nhận OTP ───────────────────────────────────────────────────────────
  const handleConfirm = () => {
    const otpStr = otp.join('');
    if (otpStr.length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }
    setError('');
    onConfirm({ licensePlate: plate.trim(), otp: otpStr });
  };

  const inputClass = `
    w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
    text-white placeholder-slate-500 text-sm
    focus:outline-none focus:border-cyan-400/60 focus:bg-white/8
    transition-all duration-200
  `;

  return (
    <div className="space-y-5">
      {/* ── BƯỚC 1: Nhập biển số ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label
              className="block text-xs text-slate-400 uppercase tracking-widest mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Biển số xe
            </label>
            <input
              type="text"
              value={plate}
              onChange={e => { setPlate(e.target.value.toUpperCase()); setError(''); }}
              placeholder="VD: 51A-12345"
              className={inputClass}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              maxLength={10}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm hover:border-white/20 hover:text-white transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Hủy
            </button>
            <button
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black transition-all duration-200 disabled:opacity-50"
              style={{
                fontFamily: "'Syne', sans-serif",
                background: sendingOtp
                  ? 'rgba(6,182,212,0.4)'
                  : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow: sendingOtp ? 'none' : '0 0 16px rgba(6,182,212,0.35)',
              }}
            >
              {sendingOtp ? 'Đang gửi...' : 'Gửi OTP'}
            </button>
          </div>
        </div>
      )}

      {/* ── BƯỚC 2: Nhập OTP ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <p
              className="text-sm text-slate-400 mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              OTP đã được gửi đến SĐT đã đăng ký
            </p>
            <p
              className="text-xs text-slate-500"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Biển số: <span className="text-cyan-400 font-semibold">{plate}</span>
            </p>
          </div>

          {/* 6-box OTP input */}
          <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className="
                  w-11 h-12 text-center text-xl font-bold
                  bg-white/5 border border-white/10 rounded-lg
                  text-white focus:outline-none focus:border-cyan-400/70
                  transition-all duration-150
                "
                style={{ fontFamily: "'Syne', sans-serif" }}
              />
            ))}
          </div>

          {/* Resend countdown */}
          <p className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {countdown > 0 ? (
              <>Gửi lại sau <span className="text-cyan-400">{countdown}s</span></>
            ) : (
              <button
                onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setError(''); }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Gửi lại OTP
              </button>
            )}
          </p>

          {error && (
            <p className="text-red-400 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setError(''); }}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm hover:border-white/20 hover:text-white transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Quay lại
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || otp.join('').length < 6}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black transition-all duration-200 disabled:opacity-50"
              style={{
                fontFamily: "'Syne', sans-serif",
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow: '0 0 16px rgba(6,182,212,0.35)',
              }}
            >
              {isLoading ? 'Đang xác nhận...' : 'Xác nhận'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
