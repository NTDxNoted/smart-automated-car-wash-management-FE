import React, { useEffect, useState, useMemo } from 'react';
import ServiceFilter from '../../components/service/ServiceFilter';
import ServiceList from '../../components/service/ServiceList';
import MembershipTiers from '../../components/home/MembershipTiers';
import { getServices } from '../../services/serviceService';
import { useLanguage } from '../../context/LanguageContext';
import heroCar from '../../assets/img/hero-car.png';
import './HomePage.css';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sliderPosition, setSliderPosition] = useState(50);
  const { t, locale } = useLanguage();
  const isVi = locale === 'vi';

  // Toggle scroll-snap layout on document element
  useEffect(() => {
    document.documentElement.classList.add('home-scroll-snap');
    return () => {
      document.documentElement.classList.remove('home-scroll-snap');
    };
  }, []);

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
    <main className="home-page overflow-x-hidden">
      {/* ── SECTION 1: Hero (Full screen) ── */}
      <section id="hero" className="w-full min-h-screen lg:h-screen lg:min-h-0 flex flex-col justify-center items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative bg-slate-50" aria-label="Giới thiệu">
        {/* soft background accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-10%] top-[-20%] w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute left-[-10%] bottom-[-30%] w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-cyan-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 w-full lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-600">
              <span className="material-symbols-outlined text-[15px] animate-pulse">sparkles</span>
              {t('heroSubtitle')}
            </span>

            <h1 className="mt-6 font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
              {t('heroTitleMain')}{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">{t('heroTitleAccent')}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-base sm:text-lg leading-relaxed text-slate-500 lg:mx-0">
              {t('heroDesc')}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center lg:justify-start gap-4 sm:flex-row">
              <a
                href="/booking"
                className="group inline-flex items-center justify-center rounded-full bg-cyan-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-cyan-600/30 hover:bg-cyan-500 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                {isVi ? 'Đặt Lịch Ngay' : 'Book a Wash'}
                <span className="material-symbols-outlined ml-1.5 text-[18px] transition-transform group-hover:translate-y-0.5">arrow_downward</span>
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                {isVi ? 'Xem Dịch Vụ' : 'View Services'}
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
              <li className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="material-symbols-outlined text-cyan-500 text-[18px]">verified_user</span> 
                {isVi ? 'Không trầy xước' : 'Zero scratches'}
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="material-symbols-outlined text-cyan-500 text-[18px]">smart_toy</span>
                {isVi ? 'Robot AI' : 'AI robotics'}
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="material-symbols-outlined text-cyan-500 text-[18px]">workspace_premium</span>
                {isVi ? 'Bảo vệ sơn xe' : 'Paint protection'}
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-cyan-500/5">
              <img
                src={heroCar}
                alt="Luxury car being cleaned by an automated AI robotics car wash system"
                className="aspect-[4/3] w-full object-cover object-right scale-140 origin-right transition-transform duration-700 hover:scale-145"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-xl">
              <span className="flex w-9 h-9 items-center justify-center rounded-full bg-cyan-50 text-cyan-500">
                <span className="material-symbols-outlined text-lg">local_car_wash</span>
              </span>
              <div className="text-left">
                <p className="font-heading text-lg font-extrabold leading-none text-slate-800">12k+</p>
                <p className="text-xs text-slate-500 whitespace-nowrap">{isVi ? 'Lượt rửa hoàn mỹ' : 'Spotless washes delivered'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Before & After (Full screen) ── */}
      <section id="results" className="w-full min-h-screen lg:h-screen lg:min-h-0 flex flex-col justify-center items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative bg-white border-t border-slate-100">
        {/* Title & Description */}
        <div className="mb-6 relative z-10 text-center">
          <span className="text-xs tracking-[0.15em] font-extrabold text-cyan-600 uppercase bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-200/60 inline-block mb-3 shadow-sm">
            {t('baTag')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('baTitle')}
          </h2>
          <p className="text-slate-600 mt-3 text-xs sm:text-base max-w-3xl mx-auto leading-relaxed">
            {t('baDesc')}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 relative z-10">
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

        {/* Draggable comparison container */}
        <div className="w-full max-w-5xl bg-white p-6 sm:p-10 border border-cyan-100 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.15)] rounded-[2rem] mx-auto relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.08)_0%,transparent_50%)] pointer-events-none"></div>
          
          <div className="relative w-full max-h-[42vh] aspect-[16/10] md:aspect-[16/8] rounded-2xl overflow-hidden border border-slate-100 shadow-lg select-none group z-10">
            <div className="scan-line pointer-events-none z-10"></div>

            <img 
              src="/clean_seat.png" 
              alt="After cleaning" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 sm:px-2.5 py-1 rounded-full shadow-md z-20">
              {locale === 'en' ? 'AFTER' : 'SAU'}
            </div>

            <img 
              src="/dirty_seat.png" 
              alt="Before cleaning" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 sm:px-2.5 py-1 rounded-full shadow-md z-20">
              {locale === 'en' ? 'BEFORE' : 'TRƯỚC'}
            </div>

            <div 
              className="absolute top-0 bottom-0 w-1 bg-cyan-500 z-20 pointer-events-none shadow-[0_0_10px_#06b6d4]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] z-30 cursor-ew-resize hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-xs sm:text-sm font-bold">unfold_more</span>
              </div>
            </div>

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

      {/* ── SECTION 3: Membership Tiers (Full screen) ── */}
      <section id="membership" className="w-full min-h-screen lg:h-screen lg:min-h-0 flex flex-col justify-center items-center pt-14 pb-10 px-4 sm:px-6 lg:px-8 relative bg-slate-50 border-t border-slate-100">
        <MembershipTiers />
      </section>

      {/* ── SECTION 4: Service Catalog (Full screen) ── */}
      <section id="services" className="w-full min-h-screen lg:h-screen lg:min-h-0 flex flex-col justify-center items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative bg-white border-t border-slate-100" aria-label="Danh mục dịch vụ">
        <div className="catalog__inner w-full max-w-7xl mx-auto flex flex-col lg:max-h-[75vh] overflow-hidden">
          <div className="catalog__header text-center mb-6 shrink-0">
            <h2 className="catalog__title">{t('catalogTitle')}</h2>
            <p className="catalog__subtitle">{t('catalogSubtitle')}</p>
          </div>

          <div className="shrink-0 mb-6">
            <ServiceFilter active={activeCategory} onChange={setActiveCategory} />
          </div>

          {error && !loading && (
            <div className="catalog__error shrink-0" role="alert">
              <span aria-hidden="true">⚠️</span> {error}
            </div>
          )}

          {!error && (
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <ServiceList
                services={filteredServices}
                loading={loading}
                activeCategory={activeCategory}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
