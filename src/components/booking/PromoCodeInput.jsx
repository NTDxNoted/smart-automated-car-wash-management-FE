import React, { useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { useLanguage } from '../../context/LanguageContext';

export default function PromoCodeInput({ onValidateSuccess }) {
  const { t, locale } = useLanguage();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await bookingService.validatePromo(code.trim().toUpperCase());
      if (res.isValid) {
        onValidateSuccess(res);
        setSuccessMsg(
          `${t('promoSuccess')} ${
            res.discountType === 'PERCENT'
              ? res.discountValue + '%'
              : res.discountValue.toLocaleString('vi-VN') + (locale === 'en' ? ' VND' : 'đ')
          }`
        );
      }
    } catch (err) {
      setError(err?.response?.data?.message || t('promoInvalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        <span className="material-symbols-outlined text-base text-cyan-600">local_offer</span>
        {t('promoLabel')}
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder={t('promoPlaceholder')}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm uppercase text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 transition-colors"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className="whitespace-nowrap rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
              {t('btnChecking')}
            </>
          ) : t('btnApply')}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
      {successMsg && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          {successMsg}
        </p>
      )}
    </div>
  );
}