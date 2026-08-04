import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { promotionService } from '../../services/promotionService';
import { useLanguage } from '../../context/LanguageContext';

export default function NotificationBell({ user }) {
  const { locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState('');
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const data = await promotionService.getPromotions();
        const list = Array.isArray(data) ? data : [];
        setPromotions(list);

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

  // Update position whenever opening or window resizes
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = window.innerWidth < 640 ? 320 : 384; // 80 (320px) or 96 (384px)
      const left = Math.max(12, rect.right - popoverWidth);
      setPopoverPos({
        top: rect.bottom + 8,
        left: left,
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current && !popoverRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

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

  const popoverContent = (
    <div
      ref={popoverRef}
      className="fixed w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-[999999] overflow-hidden"
      style={{
        top: `${popoverPos.top}px`,
        left: `${popoverPos.left}px`,
        zIndex: 999999,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-400 text-lg">campaign</span>
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-white">
            {locale === 'en' ? 'Promotions & Offers' : 'Thông Báo & Ưu Đãi'}
          </h3>
        </div>
        <span className="text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
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
            <span className="font-medium">{locale === 'en' ? 'No active promotions right now.' : 'Hiện chưa có chương trình ưu đãi mới.'}</span>
          </div>
        ) : (
          promotions.map((p, idx) => {
            const code = p.code || p.promoCode || p.promo_code || `PROMO-${idx + 1}`;
            const isCopied = copiedCode === code;

            return (
              <div key={p.id || idx} className="p-4 hover:bg-cyan-50/30 transition-colors duration-150 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                      {code}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                      {formatDiscount(p)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(code)}
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1 ${
                      isCopied
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-cyan-50 hover:bg-cyan-500 text-cyan-700 hover:text-white border border-cyan-200'
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
  );

  return (
    <div className="relative inline-block">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-600 flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none border border-slate-200/60 shadow-xs"
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

      {/* Portal Popover Content */}
      {isOpen && ReactDOM.createPortal(popoverContent, document.body)}
    </div>
  );
}
