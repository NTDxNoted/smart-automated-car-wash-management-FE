import React, { useEffect, useState, useMemo } from 'react';
import ServiceFilter from '../../components/service/ServiceFilter';
import ServiceList from '../../components/service/ServiceList';
import { getServices } from '../../services/serviceService';
import './HomePage.css';

/**
 * HomePage — Trang chủ
 * Hiển thị Hero section + danh sách dịch vụ đang Active
 * Accessible bởi cả Guest và Member (không yêu cầu auth)
 *
 * Checklist FE-ISSUE-03:
 * ✅ Gọi GET /api/services khi load trang
 * ✅ Service card: tên, giá (format VND + VAT label), thời gian, mô tả, nút đặt lịch
 * ✅ Filter tabs: Tất cả / Basic / Premium / Detail / AddOn
 * ✅ Click "Đặt lịch" → /booking?serviceId=X
 * ✅ Loading skeleton khi fetch
 * ✅ Empty state nếu rỗng
 * ✅ BR-36: "Giá đã bao gồm VAT" (trong ServiceCard)
 * ✅ BR-37: Backend đã lọc Inactive — không filter thêm ở FE
 */
export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch services on mount (BR-37: backend đã lọc Inactive)
  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      setLoading(true);
      setError(null);
      try {
        const data = await getServices();
        if (!cancelled) setServices(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Không thể tải danh sách dịch vụ.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchServices();
    return () => { cancelled = true; };
  }, []);

  // Filter theo category (client-side, chỉ lọc category tab)
  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter(
      (s) => s.serviceCategory?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [services, activeCategory]);

  return (
    <main className="home-page">
      {/* ── Hero Section ── */}
      <section className="hero" aria-label="Giới thiệu">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__inner">
          <p className="hero__eyebrow">Dịch vụ chăm sóc xe chuyên nghiệp</p>
          <h1 className="hero__title tracking-wide antialiased">
            Xe sạch — <br />
            <span className="hero__title-accent">Lái tự tin</span>
          </h1>
          <p className="hero__subtitle">
            Đặt lịch rửa xe, đánh bóng, bảo dưỡng nhanh chóng.<br />
            Không cần chờ đợi, nhận xe đúng giờ.
          </p>
          <a href="#services" className="hero__cta">
            Xem dịch vụ ↓
          </a>
        </div>
      </section>

      {/* ── Service Catalog ── */}
      <section id="services" className="catalog" aria-label="Danh mục dịch vụ">
        <div className="catalog__inner">
          <div className="catalog__header">
            <h2 className="catalog__title">Dịch vụ của chúng tôi</h2>
            <p className="catalog__subtitle">Chọn gói phù hợp với nhu cầu của bạn</p>
          </div>

          {/* Filter tabs */}
          <ServiceFilter active={activeCategory} onChange={setActiveCategory} />

          {/* Error state */}
          {error && !loading && (
            <div className="catalog__error" role="alert">
              <span aria-hidden="true">⚠️</span> {error}
            </div>
          )}

          {/* Service grid */}
          {!error && (
            <ServiceList
              services={filteredServices}
              loading={loading}
              activeCategory={activeCategory}
            />
          )}
        </div>
      </section>
    </main>
  );
}
