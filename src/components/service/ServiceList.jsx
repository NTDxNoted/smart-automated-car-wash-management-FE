import React, { memo } from 'react';
import ServiceCard from './ServiceCard';

/** Loading skeleton cho 1 card */
function ServiceCardSkeleton() {
  return (
    <div className="service-card service-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--badge" />
      <div className="service-card__body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text skeleton--text-short" />
      </div>
      <div className="service-card__meta">
        <div className="skeleton skeleton--meta" />
        <div className="skeleton skeleton--price" />
      </div>
      <div className="skeleton skeleton--btn" />
    </div>
  );
}

/** Empty state khi không có dịch vụ */
function EmptyState({ category }) {
  return (
    <div className="service-list__empty" role="status">
      <span className="service-list__empty-icon" aria-hidden="true">🔍</span>
      <p className="service-list__empty-title">Không có dịch vụ nào</p>
      <p className="service-list__empty-sub">
        {category && category !== 'all'
          ? `Chưa có dịch vụ thuộc nhóm "${category}".`
          : 'Hiện chưa có dịch vụ nào khả dụng. Vui lòng quay lại sau.'}
      </p>
    </div>
  );
}

/**
 * ServiceList — Render grid services với skeleton + empty state
 * @param {{ services: Array, loading: boolean, activeCategory: string }} props
 */
const ServiceList = memo(function ServiceList({ services, loading, activeCategory }) {
  const SKELETON_COUNT = 6;

  if (loading) {
    return (
      <div className="service-list" aria-busy="true" aria-label="Đang tải danh sách dịch vụ">
        {/* key=index chấp nhận được: skeleton không có id, không reorder, chỉ là placeholder UI */}
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="service-list">
        <EmptyState category={activeCategory} />
      </div>
    );
  }

  return (
    <div className="service-list" role="list" aria-label="Danh sách dịch vụ">
      {services.map((service) => (
        <div key={service.serviceId} role="listitem">
          <ServiceCard service={service} />
        </div>
      ))}
    </div>
  );
});

export default ServiceList;
