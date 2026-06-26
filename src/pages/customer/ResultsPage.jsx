import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './HomePage.css';

export default function ResultsPage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const { t, locale } = useLanguage();

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8">
      {/* 💡 Spacer to push content below the navbar */}
      <div className="h-16 w-full block" aria-hidden="true"></div>

      <section className="ba-section py-16 px-4 sm:px-6 w-full max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Title & Description */}
        <div className="mb-8 relative z-10">
          <span className="text-xs tracking-[0.15em] font-extrabold text-cyan-600 uppercase bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-200/60 inline-block mb-4 shadow-sm">
            {t('baTag')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            {t('baTitle')}
          </h1>
          <p className="text-slate-600 mt-3 text-xs sm:text-base max-w-3xl mx-auto leading-relaxed">
            {t('baDesc')}
          </p>
        </div>

        {/* Comparison indicators */}
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

        {/* Interactive Image Compare Card */}
        <div className="w-full max-w-5xl bg-white p-6 sm:p-10 border border-cyan-100 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.15)] rounded-[2rem] mx-auto relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.08)_0%,transparent_50%)] pointer-events-none"></div>
          
          <div className="relative w-full aspect-[16/10] md:aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-lg select-none group z-10">
            <div className="scan-line pointer-events-none z-10"></div>

            {/* After Image */}
            <img 
              src="/clean_seat.png" 
              alt="After cleaning" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 sm:px-2.5 py-1 rounded-full shadow-md z-20">
              {locale === 'en' ? 'AFTER' : 'SAU'}
            </div>

            {/* Before Image (Clipped) */}
            <img 
              src="/dirty_seat.png" 
              alt="Before cleaning" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 sm:px-2.5 py-1 rounded-full shadow-md z-20">
              {locale === 'en' ? 'BEFORE' : 'TRƯỚC'}
            </div>

            {/* Slider Divider */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-cyan-500 z-20 pointer-events-none shadow-[0_0_10px_#06b6d4]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] z-30 cursor-ew-resize hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-xs sm:text-sm font-bold">unfold_more</span>
              </div>
            </div>

            {/* Range Input for dragging */}
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
    </div>
  );
}
