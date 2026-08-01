import React, { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * ServiceFilter — Tab bar lọc theo category với kiểu dáng viên thuốc đồng bộ toàn bộ ứng dụng
 * @param {{ active: string, onChange: (cat: string) => void }} props
 */
const ServiceFilter = memo(function ServiceFilter({ active, onChange }) {
  const { locale } = useLanguage();

  const categories = [
    { value: 'all', label: locale === 'en' ? 'All Services' : 'Tất cả' },
    { value: 'Basic', label: 'Basic' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Detail', label: 'Detail' },
    { value: 'AddOn', label: 'Add-On' },
  ];

  return (
    <div 
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" 
      role="tablist" 
      aria-label="Lọc theo danh mục dịch vụ"
    >
      {categories.map((cat) => {
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(cat.value)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap ${
              isActive
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 border border-cyan-600 ring-2 ring-cyan-500/20'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
});

export default ServiceFilter;
