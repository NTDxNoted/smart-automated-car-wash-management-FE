import React, { useState, useEffect, useRef } from 'react';
import { promotionService } from '../../services/promotionService';
import { useLanguage } from '../../context/LanguageContext';

export default function NotificationBell({ user }) {
  const { locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState('');
  const popoverRef = useRef(null);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const data = await promotionService.getPromotions();
        const list = Array.isArray(data) ? data : [];
        setPromotions(list);
        
        // Mark active promos as unread badge count
        const activeCount = list.filter(p => p.isActive !== false).length;
        setUnreadCount(activeCount);
      } catch (err) {
        console.error("Lỗi fetch thông báo ưu đãi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Clear badge on open
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  function formatDiscount(p) {
    const val = p.discountValue || p.discountAmount || p.value || 0;
    const typeStr = String(p.discountType || p.type || '').toLowerCase();
    if (typeStr.includes('percent')) {
      return `Giảm ${val}%`;
    }
    return `Giảm ${val.toLocaleString('vi-VN')}đ`;
  }

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-600 flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
        title={locale === 'en' ? 'Promotions & Notifications' : 'Thông báo & Ưu đãi'}
      >
        <span className="material-symbols-outlined text-xl">notifications</span>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-lg">campaign</span>
              <h3 className="text-sm font-extrabold tracking-wide uppercase">
                {locale === 'en' ? 'Promotions & Offers' : 'Thông Báo & Ưu Đãi'}
              </h3>
            </div>
            <span className="text-[11px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
              {promotions.length} {locale === 'en' ? 'offers' : 'mã'}
            </span>
          </div>

          {/* Body List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-booking-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-xl text-cyan-500">progress_activity</span>
                <span>{locale === 'en' ? 'Loading offers...' : 'Đang tải ưu đãi...'}</span>
              </div>
            ) : promotions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-slate-300">loyalty</span>
                <span>{locale === 'en' ? 'No active promotions right now.' : 'Hiện chưa có chương trình ưu đãi mới.'}</span>
              </div>
            ) : (
              promotions.map((p, idx) => {
                const code = p.code || p.promoCode || p.promo_code || `PROMO-${idx + 1}`;
                const isCopied = copiedCode === code;

                return (
                  <div key={p.id || idx} className="p-4 hover:bg-slate-50/80 transition-colors duration-150 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-mono bg-cyan-50 text-cyan-700 px-2 py-1 rounded-md border border-cyan-200">
                          {code}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {formatDiscount(p)}
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleCopyCode(code)}
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1 ${
                          isCopied
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-cyan-500 hover:text-white text-slate-700'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isCopied ? 'check' : 'content_copy'}
                        </span>
                        {isCopied ? (locale === 'en' ? 'Copied' : 'Đã chép') : (locale === 'en' ? 'Copy' : 'Sao chép')}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {p.description || p.name || (locale === 'en' ? 'Special discount for car wash service' : 'Ưu đãi rửa xe đặc biệt')}
                    </p>

                    {p.minOrderAmount > 0 && (
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {locale === 'en' ? 'Min order:' : 'Đơn tối thiểu:'} {p.minOrderAmount.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-500">
              {locale === 'en' ? 'Enter promo code at Step 3 to apply' : 'Nhập mã ưu đãi tại Bước 3 Đặt lịch để áp dụng'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
