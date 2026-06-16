import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function MembershipTiers() {
  const { locale } = useLanguage();
  const isVi = locale === 'vi';

  // Data mirrors the Tier table in autowash_supabase_3.sql exactly
  const tiers = [
    {
      id: 1,
      name: 'Member',
      subtitle: isVi ? 'Cấp độ khởi đầu' : 'Starter Level',
      icon: 'person',
      requireLabel: isVi ? 'Miễn phí — Đăng ký ngay' : 'Free — Sign up now',
      features: [
        { icon: 'percent',        label: isVi ? 'Không giảm giá' : 'No discount' },
        { icon: 'stars',          label: isVi ? 'Nhân x1.0 điểm' : 'x1.0 point multiplier' },
        { icon: 'calendar_month', label: isVi ? 'Đặt lịch trước 7 ngày' : 'Book up to 7 days ahead' },
        { icon: 'local_car_wash', label: isVi ? 'Không yêu cầu số lần rửa' : 'No wash requirement' },
      ],
      cta: isVi ? 'Bắt đầu ngay' : 'Get Started',
      ctaLink: '/register',
      // Visual identity — slate/neutral feel
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-500',
      cardBorder: 'border-slate-200',
      cardHover: 'hover:border-slate-300 hover:shadow-lg',
      checkColor: 'text-cyan-500',
      requireBg: 'bg-slate-50 text-slate-500 border-slate-200',
      btnClass: 'border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-cyan-400 hover:text-cyan-600',
    },
    {
      id: 2,
      name: 'Silver',
      subtitle: isVi ? 'Tối ưu chi phí' : 'Value Champion',
      icon: 'military_tech',
      requireLabel: isVi ? 'Chi tiêu ≥ 500.000đ hoặc ≥ 8 lần rửa' : 'Spend ≥ 500K VND or ≥ 8 washes',
      features: [
        { icon: 'percent',        label: isVi ? 'Giảm 5% mọi dịch vụ' : '5% off all services' },
        { icon: 'stars',          label: isVi ? 'Nhân x1.1 điểm' : 'x1.1 point multiplier' },
        { icon: 'calendar_month', label: isVi ? 'Đặt lịch trước 10 ngày' : 'Book up to 10 days ahead' },
        { icon: 'priority_high',  label: isVi ? 'Ưu tiên xếp hàng Silver' : 'Silver-tier queue priority' },
      ],
      cta: isVi ? 'Nâng lên Silver' : 'Go Silver',
      ctaLink: '/register',
      // Visual identity — cool silver gradient
      iconBg: 'bg-gradient-to-br from-slate-200 to-slate-300',
      iconColor: 'text-slate-600',
      cardBorder: 'border-slate-300',
      cardHover: 'hover:border-slate-400 hover:shadow-lg',
      checkColor: 'text-cyan-500',
      requireBg: 'bg-slate-100 text-slate-500 border-slate-200',
      btnClass: 'border border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-cyan-400 hover:text-cyan-600',
    },
    {
      id: 3,
      name: 'Gold',
      subtitle: isVi ? 'Ưu đãi thượng lưu' : 'Premium Experience',
      icon: 'star',
      popular: true,
      requireLabel: isVi ? 'Chi tiêu ≥ 1.500.000đ hoặc ≥ 20 lần rửa' : 'Spend ≥ 1.5M VND or ≥ 20 washes',
      features: [
        { icon: 'percent',        label: isVi ? 'Giảm 10% mọi dịch vụ' : '10% off all services' },
        { icon: 'stars',          label: isVi ? 'Nhân x1.3 điểm' : 'x1.3 point multiplier' },
        { icon: 'calendar_month', label: isVi ? 'Đặt lịch trước 12 ngày' : 'Book up to 12 days ahead' },
        { icon: 'fast_forward',   label: isVi ? 'Ưu tiên phục vụ Gold lane' : 'Gold-priority service lane' },
      ],
      cta: isVi ? 'Nâng lên Gold' : 'Go Gold',
      ctaLink: '/register',
      // Visual identity — golden luxury
      iconBg: 'bg-gradient-to-br from-amber-100 to-yellow-200',
      iconColor: 'text-amber-600',
      cardBorder: 'border-amber-300',
      cardHover: 'hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
      checkColor: 'text-amber-500',
      requireBg: 'bg-amber-50 text-amber-700 border-amber-200',
      btnClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-black hover:brightness-105 shadow-md hover:shadow-lg',
    },
    {
      id: 4,
      name: 'Platinum',
      subtitle: isVi ? 'Đẳng cấp tối thượng' : 'Ultimate Status',
      icon: 'diamond',
      requireLabel: isVi ? 'Chi tiêu ≥ 3.000.000đ hoặc ≥ 40 lần rửa' : 'Spend ≥ 3M VND or ≥ 40 washes',
      features: [
        { icon: 'percent',          label: isVi ? 'Giảm 15% mọi dịch vụ' : '15% off all services' },
        { icon: 'stars',            label: isVi ? 'Nhân x1.5 điểm' : 'x1.5 point multiplier' },
        { icon: 'calendar_month',   label: isVi ? 'Đặt lịch trước 14 ngày' : 'Book up to 14 days ahead' },
        { icon: 'workspace_premium',label: isVi ? 'Ưu tiên tối đa — Platinum lane' : 'Max priority — Platinum lane' },
      ],
      cta: isVi ? 'Liên hệ nâng cấp' : 'Contact Us',
      ctaLink: '/register',
      // Visual identity — cyan diamond luxury
      iconBg: 'bg-gradient-to-br from-cyan-100 to-sky-200',
      iconColor: 'text-cyan-600',
      cardBorder: 'border-cyan-300',
      cardHover: 'hover:border-cyan-400 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]',
      checkColor: 'text-cyan-500',
      requireBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      btnClass: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold hover:brightness-105 shadow-md hover:shadow-lg',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 w-full membership-tiers-section">

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header — matches homepage style */}
        <div className="text-center membership-tiers-header">
          <span className="text-xs tracking-[0.15em] font-extrabold text-cyan-600 uppercase bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-200/60 inline-block mb-2 shadow-sm">
            {isVi ? 'HẠNG THÀNH VIÊN' : 'MEMBERSHIP TIERS'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            {isVi ? 'Đặc Quyền Dành Riêng' : 'Exclusive Privileges'}<br />
            <span className="text-cyan-500">
              {isVi ? 'Cho Mọi Hạng Thành Viên' : 'For Every Member Tier'}
            </span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start justify-center membership-tiers-grid">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col items-center text-center rounded-2xl border bg-white p-8 transition-all duration-300 hover:-translate-y-2
                ${tier.cardBorder} ${tier.cardHover}
                ${tier.popular ? 'lg:scale-[1.05] z-10 shadow-[0_4px_20px_rgba(245,158,11,0.10)]' : 'shadow-sm'}`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  ⭐ {isVi ? 'PHỔ BIẾN NHẤT' : 'MOST POPULAR'}
                </div>
              )}

              {/* Tier icon badge */}
              <div className="mb-6 pt-2 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl ${tier.iconBg} flex items-center justify-center mb-4 shadow-sm`}>
                  <span className={`material-symbols-outlined text-3xl ${tier.iconColor}`}>
                    {tier.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">{tier.subtitle}</p>
              </div>

              {/* Requirement pill */}
              <div className={`text-[11px] font-semibold rounded-lg px-3 py-2.5 mb-6 leading-snug border ${tier.requireBg}`}>
                <span className="opacity-60 mr-1">{isVi ? 'Điều kiện:' : 'Requires:'}</span>
                {tier.requireLabel}
              </div>

              <div className="border-t border-slate-100 mb-6" />

              {/* Features */}
              <ul className="flex-1 space-y-4 mb-8 w-full">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-center justify-center gap-3 text-sm">
                    <span className={`material-symbols-outlined text-[17px] shrink-0 ${tier.checkColor}`}>
                      {f.icon}
                    </span>
                    <span className="text-slate-700 leading-snug">{f.label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={tier.ctaLink}
                className={`block w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${tier.btnClass}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
