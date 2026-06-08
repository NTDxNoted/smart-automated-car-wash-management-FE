import React, { memo } from 'react';

export const CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Basic', label: 'Basic' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Detail', label: 'Detail' },
  { value: 'AddOn', label: 'Add-On' },
];

/**
 * ServiceFilter — Tab bar lọc theo category
 * @param {{ active: string, onChange: (cat: string) => void }} props
 */
const ServiceFilter = memo(function ServiceFilter({ active, onChange }) {
  return (
    <div className="service-filter" role="tablist" aria-label="Lọc theo danh mục dịch vụ">
      {CATEGORIES.map((cat) => (
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
