import React from 'react';

export default function InvoicePreview({ invoice }) {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 font-mono">
            <h4 className="text-sm font-bold text-slate-600 font-sans uppercase tracking-wider border-b border-slate-200 pb-2">
                Chi tiết hoá đơn
            </h4>
            <div className="flex justify-between text-sm">
                <span className="text-slate-600">Giá gốc (Base Amount):</span>
                <span className="text-slate-800 font-medium">{invoice.baseAmount.toLocaleString('vi-VN')} đ</span>
            </div>

            {/* BR-23: TierDiscount tự động — không có checkbox */}
            {invoice.tierDiscount > 0 && (
                <div className="flex justify-between text-sm text-cyan-600">
                    <span>Ưu đãi hạng thành viên:</span>
                    <span className="font-medium">-{invoice.tierDiscount.toLocaleString('vi-VN')} đ</span>
                </div>
            )}

            {invoice.promotionDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                    <span>Khuyến mãi áp dụng:</span>
                    <span className="font-medium">-{invoice.promotionDiscount.toLocaleString('vi-VN')} đ</span>
                </div>
            )}

            {invoice.rewardDiscount > 0 && (
                <div className="flex justify-between text-sm text-purple-600">
                    <span>Đổi thưởng điểm tích lũy:</span>
                    <span className="font-medium">-{invoice.rewardDiscount.toLocaleString('vi-VN')} đ</span>
                </div>
            )}

            <div className="flex justify-between text-lg font-bold font-sans border-t border-slate-200 pt-3 text-slate-800">
                <span>Tổng thanh toán:</span>
                <span className="text-cyan-600 text-xl">{invoice.finalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
        </div>
    );
}