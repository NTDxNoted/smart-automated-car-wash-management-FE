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
        { icon: 'percent', label: isVi ? 'Không giảm giá' : 'No discount' },
        { icon: 'stars', label: isVi ? 'Nhân x1.0 điểm' : 'x1.0 point multiplier' },
        { icon: 'calendar_month', label: isVi ? 'Đặt lịch trước 7 ngày' : 'Book up to 7 days ahead' },
        { icon: 'local_car_wash', label: isVi ? 'Không yêu cầu số lần rửa' : 'No wash requirement' },
      ],
      cta: isVi ? 'Bắt đầu ngay' : 'Get Started',
      ctaLink: '/register',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-400',
      cardBorder: 'border-slate-200',
      cardHover: 'hover:border-slate-300 hover:shadow-lg',
      checkColor: 'text-slate-400',
      requireBg: 'bg-slate-50 text-slate-500 border-slate-200',
      btnClass: 'border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-700',
    },
    {
      id: 2,
      name: 'Silver',
      subtitle: isVi ? 'Tối ưu chi phí' : 'Value Champion',
      icon: 'military_tech',
      requireLabel: isVi ? 'Chi tiêu ≥ 500.000đ hoặc ≥ 8 lần rửa' : 'Spend ≥ 500K VND or ≥ 8 washes',
      features: [
        { icon: 'percent', label: isVi ? 'Giảm 5% mọi dịch vụ' : '5% off all services' },
        { icon: 'stars', label: isVi ? 'Nhân x1.1 điểm' : 'x1.1 point multiplier' },
        { icon: 'calendar_month', label: isVi ? 'Đặt lịch trước 10 ngày' : 'Book up to 10 days ahead' },
        { icon: 'priority_high', label: isVi ? 'Ưu tiên xếp hàng Silver' : 'Silver-tier queue priority' },
      ],
      cta: isVi ? 'Nâng lên Silver' : 'Go Silver',
      ctaLink: '/register',
      iconBg: 'bg-gradient-to-br from-slate-200 to-slate-300',
      iconColor: 'text-slate-500',
      cardBorder: 'border-slate-300',
      cardHover: 'hover:border-slate-400 hover:shadow-lg',
      checkColor: 'text-slate-500',
      requireBg: 'bg-slate-100 text-slate-600 border-slate-200',
      btnClass: 'border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-700',
    },
    {
      id: 3,
      name: 'Gold',
      subtitle: isVi ? 'Ưu đãi thượng lưu' : 'Premium Experience',
      icon: 'star',
      popular: true,
      requireLabel: isVi ? 'Chi tiêu ≥ 1.500.000đ hoặc ≥ 20 lần rửa' : 'Spend ≥ 1.5M VND or ≥ 20 washes',
      features: [
        { icon: 'percent', label: isVi ? 'Giảm 10% mọi dịch vụ' : '10% off all services' },
        { icon: 'stars', label: isVi ? 'Nhân x1.3 điểm' : 'x1.3 point multiplier' },
        { icon: 'calendar_month', label: isVi ? 'Đặt lịch trước 12 ngày' : 'Book up to 12 days ahead' },
        { icon: 'fast_forward', label: isVi ? 'Ưu tiên phục vụ Gold lane' : 'Gold-priority service lane' },
      ],
      cta: isVi ? 'Nâng lên Gold' : 'Go Gold',
      ctaLink: '/register',
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
      premium: true,
      requireLabel: isVi ? 'Chi tiêu ≥ 3.000.000đ hoặc ≥ 40 lần rửa' : 'Spend ≥ 3M VND or ≥ 40 washes',
      features: [
        { icon: 'percent', label: isVi ? 'Giảm 15% mọi dịch vụ' : '15% off all services' },
        { icon: 'stars', label: isVi ? 'Nhân x1.5 điểm' : 'x1.5 point multiplier' },
        { icon: 'calendar_month', label: isVi ? 'Đặt lịch trước 14 ngày' : 'Book up to 14 days ahead' },
        { icon: 'workspace_premium', label: isVi ? 'Ưu tiên tối đa — Platinum lane' : 'Max priority — Platinum lane' },
      ],
      cta: isVi ? 'Liên hệ nâng cấp' : 'Contact Us',
      ctaLink: '/register',
      iconBg: 'bg-gradient-to-br from-violet-100 to-purple-200',
      iconColor: 'text-violet-600',
      cardBorder: 'border-violet-300',
      cardHover: 'hover:border-violet-400 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]',
      checkColor: 'text-violet-500',
      requireBg: 'bg-violet-50 text-violet-700 border-violet-200',
      btnClass: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold hover:brightness-105 shadow-md hover:shadow-lg',
    },
  ];

  return (
    <div className="py-2 px-4 sm:px-6 w-full max-w-7xl mx-auto membership-tiers-section shrink-0">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch justify-center membership-tiers-grid pt-6 mb-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`membership-tier-card relative flex flex-col items-center text-center rounded-2xl border bg-white px-6 pt-8 pb-6 transition-all duration-300 hover:-translate-y-2
                 ${tier.cardBorder} ${tier.cardHover}
                 ${tier.popular ? 'z-10 shadow-[0_10px_35px_rgba(245,158,11,0.18)] border-amber-400 ring-2 ring-amber-400/40' :
                   tier.premium ? 'shadow-[0_10px_35px_rgba(139,92,246,0.18)] border-violet-400 ring-2 ring-violet-400/40' :
                   'shadow-sm'}`}
          >
            {/* Popular badge */}
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold tracking-wide px-5 py-1.5 rounded-full shadow-lg shadow-amber-300/50">
                  🏆 {isVi ? 'Phổ biến nhất' : 'Most Popular'}
                </span>
              </div>
            )}

            {/* Tier icon badge & titles */}
            <div className="tier-header flex flex-col items-center gap-2 mb-3 shrink-0 w-full">
              <div className={`w-16 h-16 rounded-full ${tier.iconBg} flex items-center justify-center shadow-sm mt-2`}>
                <span className={`material-symbols-outlined text-4xl ${tier.iconColor}`}>
                  {tier.icon}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{tier.name}</h3>
              <p className="text-sm text-slate-400 font-medium leading-normal">{tier.subtitle}</p>
            </div>
            {/* Requirement pill */}
            <div className="tier-requirement flex flex-col items-center gap-1.5 py-1 mb-6 shrink-0 w-full">
              <span className="text-sm uppercase font-black tracking-widest text-slate-400 leading-none">{isVi ? 'ĐIỀU KIỆN' : 'REQUIREMENT'}</span>
              <span className="font-extrabold text-sm text-slate-600 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 leading-normal text-center max-w-[90%]">
                {tier.requireLabel}
              </span>
            </div>
            <div className="tier-divider border-t border-slate-100 w-full mb-3 shrink-0" />

            {/* Features */}
            <div className="tier-features w-full flex items-center justify-center mt-3 mb-6 shrink-0">
              <div className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-3.5 text-left w-fit">
                {tier.features.map((f, fi) => (
                  <React.Fragment key={fi}>
                    <span className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${tier.checkColor}`}>
                      {f.icon}
                    </span>
                    <span className="text-slate-700 text-[15px] sm:text-base font-semibold leading-normal">{f.label}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* CTA */}
            <Link
              to={tier.ctaLink}
              className={`tier-cta block w-[85%] mx-auto text-center py-4 px-6 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 ${tier.btnClass} mt-auto mb-6 shrink-0`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
