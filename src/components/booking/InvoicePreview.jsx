import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function InvoicePreview({ invoice }) {
  const { t, locale } = useLanguage();

  function formatVND(amount) {
    return amount.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN') + (locale === 'en' ? ' VND' : ' đ');
  }

  if (!invoice) return null;

  return (
    <div 
      className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-md shadow-slate-100 relative overflow-hidden"
      style={{ paddingTop: '40px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }}
    >
      {/* Decorative top strip */}
      <div 
        className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-cyan-600" 
        style={{ height: '6px' }}
      />
      
      {/* Header section of the receipt */}
      <div className="mb-4 flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
            <span className="material-symbols-outlined text-lg">receipt_long</span>
          </div>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              {t('invoiceTitle')}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">AutoWash Pro Receipt</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
          {locale === 'en' ? 'Review' : 'Kiểm tra'}
        </span>
      </div>

      <dl className="flex flex-col gap-3.5 text-sm">
        {/* Base amount */}
        <div className="flex items-center justify-between">
          <dt className="text-slate-500 font-medium">{t('invoiceBaseAmount').replace(':', '')}</dt>
          <dd className="font-bold text-slate-800">{formatVND(invoice.baseAmount)}</dd>
        </div>

        {/* Tier / Member Discount */}
        {invoice.tierDiscount > 0 && (
          <div className="flex items-center justify-between bg-cyan-50/30 px-2.5 py-1.5 rounded-lg border border-cyan-100/50">
            <dt className="text-cyan-800 font-semibold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              {invoice.memberDiscountRatePct
                ? (locale === 'en'
                    ? `Member Discount (${invoice.memberDiscountRatePct}%)`
                    : `Giảm giá Thành viên (${invoice.memberDiscountRatePct}%)`)
                : (t('invoiceTierDiscount').replace(':', ''))}
            </dt>
            <dd className="font-extrabold text-cyan-600 text-xs">- {formatVND(invoice.tierDiscount)}</dd>
          </div>
        )}

        {/* Promotion Discount */}
        {invoice.promotionDiscount > 0 && (
          <div className="flex items-center justify-between bg-emerald-50/30 px-2.5 py-1.5 rounded-lg border border-emerald-100/50">
            <dt className="text-emerald-800 font-semibold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">local_offer</span>
              {t('invoicePromoDiscount').replace(':', '')}
            </dt>
            <dd className="font-extrabold text-emerald-600 text-xs">- {formatVND(invoice.promotionDiscount)}</dd>
          </div>
        )}

        {/* Reward Discount */}
        {invoice.rewardDiscount > 0 && (
          <div className="flex items-center justify-between bg-purple-50/30 px-2.5 py-1.5 rounded-lg border border-purple-100/50">
            <dt className="text-purple-800 font-semibold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">stars</span>
              {t('invoiceRewardDiscount').replace(':', '')}
            </dt>
            <dd className="font-extrabold text-purple-600 text-xs">- {formatVND(invoice.rewardDiscount)}</dd>
          </div>
        )}

        {/* Dashed divider */}
        <div className="my-2 border-t-2 border-dashed border-slate-200" />

        {/* Final amount */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <dt className="text-base font-extrabold text-slate-800">{t('invoiceTotal').replace(':', '')}</dt>
            <span className="text-[10px] text-slate-400 font-medium block">{t('vatLabel') || 'Giá đã bao gồm VAT'}</span>
          </div>
          <dd className="text-2xl font-black text-cyan-600 tracking-tight">{formatVND(invoice.finalAmount)}</dd>
        </div>
      </dl>
    </div>
  );
}