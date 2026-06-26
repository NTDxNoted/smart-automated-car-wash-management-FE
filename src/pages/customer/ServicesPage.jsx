import React, { useEffect, useState, useMemo } from 'react';
import ServiceFilter from '../../components/service/ServiceFilter';
import ServiceList from '../../components/service/ServiceList';
import { getServices } from '../../services/serviceService';
import { useLanguage } from '../../context/LanguageContext';
import './HomePage.css';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { t } = useLanguage();

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

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter(
      (s) => s.serviceCategory?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [services, activeCategory]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8">
      {/* 💡 Spacer to push content below the navbar */}
      <div className="h-16 w-full block" aria-hidden="true"></div>

      <section id="services" className="catalog max-w-7xl mx-auto" aria-label="Danh mục dịch vụ">
        <div className="catalog__inner">
          <div className="catalog__header mb-10 text-center">
            <span className="text-xs tracking-[0.15em] font-extrabold text-cyan-600 uppercase bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-200/60 inline-block mb-3 shadow-sm">
              {t('catalogTitle') || 'Dịch vụ của chúng tôi'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
              {t('catalogSubtitle') || 'Chọn gói chăm sóc phù hợp nhất với xế yêu của bạn'}
            </h1>
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
    </div>
  );
}
