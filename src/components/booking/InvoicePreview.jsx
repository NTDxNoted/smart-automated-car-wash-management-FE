import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function InvoicePreview({ invoice }) {
  const { t, locale } = useLanguage();

  function formatVND(amount) {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  if (!invoice) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
        {t('invoiceTitle')}
      </h3>
      <dl className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">{t('invoiceBaseAmount').replace(':', '')}</dt>
          <dd className="font-semibold text-slate-800">{formatVND(invoice.baseAmount)}</dd>
        </div>

        {invoice.tierDiscount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-slate-600">{t('invoiceTierDiscount').replace(':', '')}</dt>
            <dd className="font-semibold text-cyan-600">- {formatVND(invoice.tierDiscount)}</dd>
          </div>
        )}

        {invoice.promotionDiscount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-slate-600">{t('invoicePromoDiscount').replace(':', '')}</dt>
            <dd className="font-semibold text-emerald-600">- {formatVND(invoice.promotionDiscount)}</dd>
          </div>
        )}

        {invoice.rewardDiscount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-slate-600">{t('invoiceRewardDiscount').replace(':', '')}</dt>
            <dd className="font-semibold text-amber-600">- {formatVND(invoice.rewardDiscount)}</dd>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3">
          <dt className="text-base font-bold text-slate-800">{t('invoiceTotal').replace(':', '')}</dt>
          <dd className="text-xl font-extrabold text-cyan-600">{formatVND(invoice.finalAmount)}</dd>
        </div>
      </dl>
    </div>
  );
}