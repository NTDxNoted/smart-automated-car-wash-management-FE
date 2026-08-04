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
  const [dismissedIds, setDismissedIds] = useState([]);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);
  const modalRef = useRef(null);

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

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const modalWidth = window.innerWidth < 640 ? 340 : 420;
      const left = Math.max(16, Math.min(window.innerWidth - modalWidth - 16, rect.right - modalWidth + 20));
      setPopoverPos({
        top: Math.max(16, rect.bottom + 12),
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current && !modalRef.current.contains(event.target) &&
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

  const handleDismiss = (id) => {
    setDismissedIds(prev => [...prev, id]);
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

  const visiblePromotions = promotions.filter(p => !dismissedIds.includes(p.id || p.code));

  const modalContent = (
    <div
      ref={modalRef}
      className="fixed w-[340px] sm:w-[420px] bg-white rounded-[28px] shadow-2xl border border-slate-200/90 z-[999999] overflow-hidden transition-all duration-200"
      style={{
        top: `${popoverPos.top}px`,
        left: `${popoverPos.left}px`,
        zIndex: 999999,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Modal Top Header - Flex alignment on exact same horizontal line */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <h3 className="text-base font-extrabold text-slate-800 tracking-tight text-center flex-1 pr-8">
          {locale === 'en' ? 'Notifications' : 'Thông báo & Ưu đãi'}
        </h3>
      </div>

      {/* Modal Body - Notification Items */}
      <div className="p-4 sm:p-5 max-h-[420px] overflow-y-auto space-y-3.5 custom-booking-scrollbar bg-slate-50/40">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-2xl text-cyan-600">progress_activity</span>
            <span className="font-semibold">{locale === 'en' ? 'Loading notifications...' : 'Đang tải thông báo...'}</span>
          </div>
        ) : visiblePromotions.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-3 bg-white rounded-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-3xl">notifications_off</span>
            </div>
            <div>
              <p className="font-bold text-slate-700 text-sm">{locale === 'en' ? 'No new notifications' : 'Không có thông báo mới'}</p>
              <p className="text-slate-400 text-xs mt-1">{locale === 'en' ? 'You are all caught up!' : 'Bạn đã xem hết tất cả thông báo!'}</p>
            </div>
          </div>
        ) : (
          visiblePromotions.map((p, idx) => {
            const promoId = p.id || p.code || idx;
            const code = p.code || p.promoCode || p.promo_code || `PROMO-${idx + 1}`;
            const isCopied = copiedCode === code;

            return (
              <div
                key={promoId}
                className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col gap-3"
              >
                {/* Upper Row: Icon, Title & Time */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-100 border border-cyan-200/60 text-cyan-600 flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-2xl">campaign</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-extrabold text-slate-800 leading-snug truncate">
                        {p.name || (locale === 'en' ? 'Special Wash Offer!' : 'Ưu đãi rửa xe cực hot!')}
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                        {p.createdAt ? 'Vừa xong' : 'Mới'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1 line-clamp-2">
                      {p.description || (locale === 'en' ? 'Get special discount for your next booking' : 'Nhận ngay giảm giá đặc biệt cho đơn rửa xe tiếp theo của bạn')}
                    </p>
                  </div>
                </div>

                {/* Badge Info */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <span className="text-xs font-black font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                    {code}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                    {formatDiscount(p)}
                  </span>
                </div>

                {/* Bottom Action Buttons - Exactly matching reference screenshot */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDismiss(promoId)}
                    className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    {locale === 'en' ? 'Dismiss' : 'Bỏ qua'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(code)}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 shadow-sm ${
                      isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isCopied ? 'check' : 'content_copy'}
                    </span>
                    {isCopied ? (locale === 'en' ? 'Copied' : 'Đã chép mã') : (locale === 'en' ? 'Copy Code' : 'Sao chép mã')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-5 py-3 bg-white border-t border-slate-100 text-center">
        <span className="text-[11px] font-semibold text-slate-400">
          {locale === 'en' ? 'Apply promo code at Step 3 of booking' : 'Nhập mã tại Bước 3 Đặt lịch để áp dụng'}
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
        title={locale === 'en' ? 'Notifications' : 'Thông báo & Ưu đãi'}
      >
        <span className="material-symbols-outlined text-xl">notifications</span>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Portal Modal Content */}
      {isOpen && ReactDOM.createPortal(modalContent, document.body)}
    </div>
  );
}
