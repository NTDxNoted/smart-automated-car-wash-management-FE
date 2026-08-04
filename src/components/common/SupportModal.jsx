import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function SupportModal({ isOpen, onClose }) {
  const { locale } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const hotline = '1900 6000';
  const emergencyPhone = '0909 123 456';

  const handleCopyHotline = (num) => {
    navigator.clipboard.writeText(num.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalJSX = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl shadow-inner">
              <span className="material-symbols-outlined">headset_mic</span>
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {locale === 'en' ? 'Customer Support' : 'Trung Tâm Hỗ Trợ KH'}
              </h3>
              <p className="text-xs text-cyan-100 font-medium">AutoWash Pro 24/7 Care</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Main Hotline Card */}
          <div className="bg-gradient-to-br from-cyan-50 to-sky-50/50 rounded-2xl p-4 border border-cyan-100 flex flex-col items-center text-center gap-3 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              {locale === 'en' ? 'Hotline Support 24/7' : 'Tổng đài Hotline CSKH'}
            </span>
            <div className="text-3xl font-black font-mono tracking-tight text-cyan-600">
              {hotline}
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full mt-1">
              <a
                href={`tel:${hotline.replace(/\s+/g, '')}`}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">call</span>
                {locale === 'en' ? 'Call Now' : 'Gọi ngay'}
              </a>

              <button
                type="button"
                onClick={() => handleCopyHotline(hotline)}
                className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? (locale === 'en' ? 'Copied' : 'Đã chép') : (locale === 'en' ? 'Copy No.' : 'Sao chép')}
              </button>
            </div>
          </div>

          {/* Additional Contact Methods */}
          <div className="space-y-2.5">
            {/* Working Hours */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">schedule</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700">{locale === 'en' ? 'Working Hours' : 'Giờ làm việc tại trạm'}</p>
                <p className="text-[11px] text-slate-500 font-medium">07:30 - 20:00 (Tất cả các ngày trong tuần)</p>
              </div>
            </div>

            {/* Emergency Technical Line */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">car_repair</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-700">{locale === 'en' ? 'Emergency Line' : 'Đường dây Cứu hộ Kỹ thuật'}</p>
                <p className="text-[11px] font-bold text-rose-600">{emergencyPhone}</p>
              </div>
              <a
                href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-[11px] transition-colors"
              >
                {locale === 'en' ? 'Call' : 'Gọi'}
              </a>
            </div>

            {/* Email Support */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">mail</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700">{locale === 'en' ? 'Email Support' : 'Email phản hồi & góp ý'}</p>
                <p className="text-[11px] text-slate-500 font-medium">support@autowashpro.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            {locale === 'en' ? 'Close' : 'Đóng cửa sổ'}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJSX, document.body);
}
