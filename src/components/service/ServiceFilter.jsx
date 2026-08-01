import React, { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const CATEGORIES = [
  { value: 'all', labelKey: 'catAll', fallback: 'Tất cả' },
  { value: 'Basic', labelKey: 'Basic', fallback: 'Basic' },
  { value: 'Premium', labelKey: 'Premium', fallback: 'Premium' },
  { value: 'Detail', labelKey: 'Detail', fallback: 'Detail' },
  { value: 'AddOn', labelKey: 'AddOn', fallback: 'Add-On' },
];

/**
 * ServiceFilter — Tab bar lọc theo category (Khôi phục nguyên bản CSS)
 * @param {{ active: string, onChange: (cat: string) => void }} props
 */
const ServiceFilter = memo(function ServiceFilter({ active, onChange }) {
  const { locale } = useLanguage();

  const categories = [
    { value: 'all', label: locale === 'en' ? 'All' : 'Tất cả' },
    { value: 'Basic', label: 'Basic' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Detail', label: 'Detail' },
    { value: 'AddOn', label: 'Add-On' },
  ];

  return (
    <div className="service-filter" role="tablist" aria-label="Lọc theo danh mục dịch vụ">
      {categories.map((cat) => (
        <button
          key={cat.value}
          role="tab"
          aria-selected={active === cat.value}
          className={`filter-tab${active === cat.value ? ' filter-tab--active' : ''}`}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
});

export default ServiceFilter;
