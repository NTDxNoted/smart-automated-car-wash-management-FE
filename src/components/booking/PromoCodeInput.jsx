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
            const res = await bookingService.validatePromo(code);
            if (res.isValid) {
                onValidateSuccess(res);
                setSuccessMsg(`${t('promoSuccess')} ${res.discountType === 'PERCENT' ? res.discountValue + '%' : res.discountValue.toLocaleString('vi-VN') + (locale === 'en' ? ' VND' : 'đ')}`);
            }
        } catch (err) {
            setError(err?.response?.data?.message || t('promoInvalid'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('promoLabel')}
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder={t('promoPlaceholder')}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-cyan-500"
                />
                <button
                    onClick={handleApply}
                    disabled={loading}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                    {loading ? t('btnChecking') : t('btnApply')}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {successMsg && <p className="text-emerald-600 text-xs">{successMsg}</p>}
        </div>
    );
}