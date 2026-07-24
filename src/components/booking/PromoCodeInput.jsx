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
      if (res && (res.isValid || res.promotionId || res.id)) {
        onValidateSuccess(res);
        const typeStr = String(res.discountType || res.DiscountType || '').toLowerCase();
        const val = Number(res.discountValue ?? res.DiscountValue ?? res.value ?? 0);
        const isPercent = typeStr.includes('percent');
        setSuccessMsg(
          `${t('promoSuccess')} ${
            isPercent
              ? val + '%'
              : val.toLocaleString('vi-VN') + (locale === 'en' ? ' VND' : 'đ')
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
      <p 
        className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider"
        style={{ marginBottom: '12px' }}
      >
        <span className="material-symbols-outlined text-base text-cyan-600">local_offer</span>
        {t('promoLabel')}
      </p>

      <div 
        className="flex items-center bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus-within:bg-white focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/40 transition-all duration-350"
        style={{ padding: '8px' }}
      >
        <span className="material-symbols-outlined text-slate-400 pl-2.5 text-lg">tag</span>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder={t('promoPlaceholder')}
          className="w-full bg-transparent px-3 py-1.5 text-sm font-semibold uppercase text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/10 cursor-pointer flex items-center justify-center gap-1"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>
              {t('btnChecking')}
            </>
          ) : (
            <>
              {t('btnApply')}
              <span className="material-symbols-outlined text-xs">check</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
      {successMsg && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {successMsg}
        </p>
      )}
    </div>
  );
}