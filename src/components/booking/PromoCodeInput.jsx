import React, { useState } from 'react';
import { bookingService } from '../../services/bookingService';

export default function PromoCodeInput({ onValidateSuccess }) {
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
                setSuccessMsg(`Áp dụng thành công mã giảm ${res.discountType === 'PERCENT' ? res.discountValue + '%' : res.discountValue.toLocaleString('vi-VN') + 'đ'}`);
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Mã khuyến mãi không hợp lệ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Mã Khuyến Mãi (Promo Code)
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Nhập mã (Ví dụ: LUXURY10)"
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                    onClick={handleApply}
                    disabled={loading}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                    {loading ? 'Đang check...' : 'Áp dụng'}
                </button>
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            {successMsg && <p className="text-emerald-400 text-xs">{successMsg}</p>}
        </div>
    );
}