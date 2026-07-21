import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function StepSelectService({ bookingData, setBookingData, onNext, servicesList }) {
  const { t, locale } = useLanguage();

  const getServiceMeta = (name) => {
    const n = name?.toLowerCase() || '';
    const isVi = locale === 'vi';
    if (n.includes('cơ bản') || n.includes('basic')) {
      return {
        icon: 'local_car_wash',
        duration: isVi ? '30 - 45 phút' : '30-45 mins',
        badge: isVi ? 'Phổ biến' : 'Popular',
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
        selectedBadgeClass: 'bg-white/20 text-white border border-white/20'
      };
    }
    if (n.includes('cao cấp') || n.includes('premium')) {
      return {
        icon: 'auto_awesome',
        duration: isVi ? '45 - 60 phút' : '45-60 mins',
        badge: isVi ? 'Bán chạy' : 'Best Seller',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        selectedBadgeClass: 'bg-white/20 text-white border border-white/20'
      };
    }
    if (n.includes('hút bụi') || n.includes('nội thất') || n.includes('vacuum')) {
      return {
        icon: 'cleaning_services',
        duration: isVi ? '60 - 75 phút' : '60-75 mins',
        badge: isVi ? 'Khuyên dùng' : 'Recommended',
        badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
        selectedBadgeClass: 'bg-white/20 text-white border border-white/20'
      };
    }
    if (n.includes('chi tiết') || n.includes('detailing') || n.includes('toàn bộ')) {
      return {
        icon: 'build_circle',
        duration: isVi ? '90 - 120 phút' : '90-120 mins',
        badge: isVi ? 'Chuyên sâu' : 'Detailing',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        selectedBadgeClass: 'bg-white/20 text-white border border-white/20'
      };
    }
    // Default
    return {
      icon: 'shield',
      duration: isVi ? '45 phút' : '45 mins',
      badge: isVi ? 'Tiêu chuẩn' : 'Standard',
      badgeClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      selectedBadgeClass: 'bg-white/20 text-white border border-white/20'
    };
  };

  function formatPrice(amount) {
    return amount.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN') + (locale === 'en' ? ' VND' : ' đ');
  }

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-slate-800 flex items-center gap-2">
        <span className="w-2.5 h-6 rounded-full bg-cyan-500"></span>
        {t('step1Title') || 'Bước 1: Chọn dịch vụ chăm sóc xe'}
      </h2>

      <div className="max-h-[460px] overflow-y-auto pr-2 custom-booking-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-1">
          {servicesList.map((service) => {
            const isSelected = bookingData.service?.id === service.id;
            const meta = getServiceMeta(service.name);

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setBookingData(prev => ({ ...prev, service }))}
                aria-pressed={isSelected}
                className={`w-full text-left flex flex-col justify-between p-5 rounded-2xl border-2 transition-all duration-300 relative cursor-pointer group ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-50/50 text-slate-800 shadow-md shadow-cyan-100 scale-[1.01] ring-2 ring-cyan-200/30'
                    : 'border-slate-100 bg-white text-slate-800 hover:border-cyan-300 hover:shadow-md hover:scale-[1.005]'
                }`}
              >
                <div className="w-full flex flex-col justify-between flex-grow" style={{ padding: '4px' }}>
                  {/* Upper row: Icon & Badge/Checkmark */}
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isSelected ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-cyan-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{meta.icon}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${meta.badgeClass}`}
                      >
                        {meta.badge}
                      </span>
                    </div>

                    {isSelected && (
                      <span
                        className="absolute -top-2.5 -right-2.5 w-6.5 h-6.5 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-md border-2 border-white animate-fade-in shrink-0 z-10"
                      >
                        <span className="material-symbols-outlined text-[12px] font-black">check</span>
                      </span>
                    )}
                  </div>

                  {/* Service Info */}
                  <div className="mt-4 flex-grow">
                    <h3 className="text-lg font-bold tracking-tight leading-snug group-hover:text-cyan-600 transition-colors duration-200">
                      {service.name}
                    </h3>
                    <p
                      className={`text-xs mt-1.5 leading-relaxed overflow-hidden text-ellipsis line-clamp-2 h-9 ${
                        isSelected ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {service.description || (locale === 'en' ? 'Premium car care service' : 'Dịch vụ chăm sóc xe chuẩn cao cấp')}
                    </p>
                  </div>

                  {/* Lower row: Duration & Price */}
                  <div
                    className={`mt-4 pt-4 border-t w-full flex items-center justify-between ${
                      isSelected ? 'border-cyan-100' : 'border-slate-100'
                    }`}
                  >
                    <div className={`flex items-center gap-1.5 text-xs ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`}>
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span className="font-medium">{meta.duration}</span>
                    </div>
                    <span className="text-lg font-extrabold font-sans tracking-tight text-cyan-600">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end py-[5px] mt-6 border-t border-slate-100">
        <button
          type="button"
          disabled={!bookingData.service}
          onClick={onNext}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 px-12 py-3.5 text-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          style={{ paddingLeft: '28px', paddingRight: '28px' }}
        >
          {t('btnContinue')}
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}