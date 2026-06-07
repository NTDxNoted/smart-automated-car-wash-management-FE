import React from 'react';

export default function InvoicePreview({ invoice }) {
    return (
        <div className="bg-neutral-900/80 border border-white/5 rounded-xl p-5 space-y-3 font-mono">
            <h4 className="text-sm font-bold text-neutral-400 font-sans uppercase tracking-wider border-b border-white/10 pb-2">
                Chi tiết hoá đơn
            </h4>
            <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Giá gốc (Base Amount):</span>
                <span>{invoice.baseAmount.toLocaleString('vi-VN')} đ</span>
            </div>

            {/* BR-23: TierDiscount tự động — không có checkbox */}
            {invoice.tierDiscount > 0 && (
                <div className="flex justify-between text-sm text-cyan-400">
                    <span>Ưu đãi hạng thành viên:</span>
                    <span>-{invoice.tierDiscount.toLocaleString('vi-VN')} đ</span>
                </div>
            )}

            {invoice.promotionDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400">
                    <span>Khuyến mãi áp dụng:</span>
                    <span>-{invoice.promotionDiscount.toLocaleString('vi-VN')} đ</span>
                </div>
            )}

            {invoice.rewardDiscount > 0 && (
                <div className="flex justify-between text-sm text-purple-400">
                    <span>Đổi thưởng điểm tích lũy:</span>
                    <span>-{invoice.rewardDiscount.toLocaleString('vi-VN')} đ</span>
                </div>
            )}

            <div className="flex justify-between text-lg font-bold font-sans border-t border-white/10 pt-3 text-white">
                <span>Tổng thanh toán:</span>
                <span className="text-cyan-400 text-xl">{invoice.finalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
        </div>
    );
}