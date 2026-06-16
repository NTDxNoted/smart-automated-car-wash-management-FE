import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function InvoicePreview({ invoice }) {
    const { t, locale } = useLanguage();
    const currencyStr = locale === 'en' ? ' VND' : ' đ';

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 font-mono">
            <h4 className="text-sm font-bold text-slate-600 font-sans uppercase tracking-wider border-b border-slate-200 pb-2">
                {t('invoiceTitle')}
            </h4>
            <div className="flex justify-between text-sm">
                <span className="text-slate-600">{t('invoiceBaseAmount')}</span>
                <span className="text-slate-800 font-medium">{invoice.baseAmount.toLocaleString('vi-VN')}{currencyStr}</span>
            </div>

            {/* BR-23: TierDiscount tự động — không có checkbox */}
            {invoice.tierDiscount > 0 && (
                <div className="flex justify-between text-sm text-cyan-600">
                    <span>{t('invoiceTierDiscount')}</span>
                    <span className="font-medium">-{invoice.tierDiscount.toLocaleString('vi-VN')}{currencyStr}</span>
                </div>
            )}

            {invoice.promotionDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                    <span>{t('invoicePromoDiscount')}</span>
                    <span className="font-medium">-{invoice.promotionDiscount.toLocaleString('vi-VN')}{currencyStr}</span>
                </div>
            )}

            {invoice.rewardDiscount > 0 && (
                <div className="flex justify-between text-sm text-purple-600">
                    <span>{t('invoiceRewardDiscount')}</span>
                    <span className="font-medium">-{invoice.rewardDiscount.toLocaleString('vi-VN')}{currencyStr}</span>
                </div>
            )}

            <div className="flex justify-between text-lg font-bold font-sans border-t border-slate-200 pt-3 text-slate-800">
                <span>{t('invoiceTotal')}</span>
                <span className="text-cyan-600 text-xl">{invoice.finalAmount.toLocaleString('vi-VN')}{currencyStr}</span>
            </div>
        </div>
    );
}