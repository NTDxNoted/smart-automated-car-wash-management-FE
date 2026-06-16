import React, { useEffect, useState, useMemo } from 'react';
import ServiceFilter from '../../components/service/ServiceFilter';
import ServiceList from '../../components/service/ServiceList';
import MembershipTiers from '../../components/home/MembershipTiers';
import { getServices } from '../../services/serviceService';
import { useLanguage } from '../../context/LanguageContext';
import './HomePage.css';

/**
 * HomePage — Trang chủ
 * Hiển thị Hero section + danh sách dịch vụ đang Active
 * Accessible bởi cả Guest và Member (không yêu cầu auth)
 */
export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sliderPosition, setSliderPosition] = useState(50);
  const { t, locale } = useLanguage();

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
          <p className="hero__eyebrow">{t('heroSubtitle')}</p>
          <h1 className="hero__title tracking-wide antialiased">
            {t('heroTitleMain')} <br />
            <span className="hero__title-accent">{t('heroTitleAccent')}</span>
          </h1>
          <p className="hero__subtitle">
            {t('heroDesc')}
          </p>
          <a href="#services" className="hero__cta">
            {t('heroCtaServices')}
          </a>
        </div>
      </section>

      {/* ── Interactive Before & After Results Section (Stitch Premium Styling) ── */}
      <section className="ba-section py-16 px-4 sm:px-6 w-full max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Title & Description moved outside the box */}
        <div className="mb-8 relative z-10">
          <span className="text-xs tracking-[0.15em] font-extrabold text-cyan-600 uppercase bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-200/60 inline-block mb-4 shadow-sm">
            {t('baTag')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('baTitle')}
          </h2>
          <p className="text-slate-600 mt-3 text-xs sm:text-base max-w-3xl mx-auto leading-relaxed">
            {t('baDesc')}
          </p>
        </div>

        {/* Brand Arrow DETAILED comparison indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 relative z-10">
          <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-red-600 border border-red-200 bg-red-50 px-2.5 sm:px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap">
            {locale === 'en' ? 'Pre-Treatment' : 'Trước khi rửa'}
          </span>
          <svg className="w-8 h-4 sm:w-16 sm:h-8 text-cyan-500 animate-pulse shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-emerald-600 border border-emerald-200 bg-emerald-50 px-2.5 sm:px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap">
            {locale === 'en' ? 'Luxe Detailing Finish' : 'Độ sạch hoàn mỹ'}
          </span>
        </div>

        {/* Clean, larger white card container */}
        <div className="w-full max-w-5xl bg-white p-6 sm:p-10 border border-cyan-100 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.15)] rounded-[2rem] mx-auto relative overflow-hidden flex flex-col items-center justify-center">
          {/* Subtle gradient background like Hero */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.08)_0%,transparent_50%)] pointer-events-none"></div>
          
          {/* Draggable Frame Container */}
          <div className="relative w-full aspect-[16/10] md:aspect-[16/8] rounded-2xl overflow-hidden border border-slate-100 shadow-lg select-none group z-10">
            {/* Scan Line Overlay */}
            <div className="scan-line pointer-events-none z-10"></div>

            {/* After Image (Background) */}
            <img 
              src="/clean_seat.png" 
              alt="After cleaning" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 sm:px-2.5 py-1 rounded-full shadow-md z-20">
              {locale === 'en' ? 'AFTER' : 'SAU'}
            </div>

            {/* Before Image (Clipped overlay) */}
            <img 
              src="/dirty_seat.png" 
              alt="Before cleaning" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 sm:px-2.5 py-1 rounded-full shadow-md z-20">
              {locale === 'en' ? 'BEFORE' : 'TRƯỚC'}
            </div>

            {/* Slider Line Divider with cyan theme */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-cyan-500 z-20 pointer-events-none shadow-[0_0_10px_#06b6d4]"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Draggable handle button with cyan theme */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] z-30 cursor-ew-resize hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-xs sm:text-sm font-bold">unfold_more</span>
              </div>
            </div>

            {/* Transparent Range Input on Top to Handle Interaction */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition} 
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 touch-none"
              aria-label="Before and after image slider"
            />
          </div>
        </div>
      </section>

      {/* ── Membership Tiers (Dark Theme) ── */}
      <MembershipTiers />

      {/* ── Service Catalog ── */}
      <section id="services" className="catalog" aria-label="Danh mục dịch vụ">
        <div className="catalog__inner">
          <div className="catalog__header">
            <h2 className="catalog__title">{t('catalogTitle')}</h2>
            <p className="catalog__subtitle">{t('catalogSubtitle')}</p>
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
