import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Hiển thị phần thưởng có thể đổi (nếu điểm >= 50)
 */
export default function RewardCard({ reward }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleUseReward = () => {
    navigate('/booking');
  };

  return (
    <div 
      className="group relative rounded-2xl border border-slate-200/80 p-6 transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:-translate-y-1 bg-white overflow-hidden"
    >
      {/* Decorative semi-circles at the left/right edges to look like a real ticket coupon */}
      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-50 border-r border-slate-200/80 rounded-full transform -translate-y-1/2 z-20 pointer-events-none" />
      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-slate-50 border-l border-slate-200/80 rounded-full transform -translate-y-1/2 z-20 pointer-events-none" />

      {/* Glow on hover */}
      <div 
        className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/[0.02] transition-colors duration-300 pointer-events-none" 
      />

      <div className="flex flex-col h-full gap-5 relative z-10">
        {/* Top section: Title/Value */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 
              className="text-2xl font-black text-cyan-600 tracking-tight group-hover:text-cyan-700 transition-colors"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              {reward.name}
            </h4>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Voucher ưu đãi
            </p>
          </div>
          {/* Ticket Icon / Badge */}
          <span className="material-symbols-outlined text-slate-300 group-hover:text-cyan-500/80 transition-colors text-3xl">
            local_activity
          </span>
        </div>

        {/* Dashed divider */}
        <div className="border-t-2 border-dashed border-slate-100 my-1" />

        {/* Bottom section: Points Required & Use Now Button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Cần tích lũy
            </span>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-2xl font-black text-slate-800"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {reward.pointsRequired}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('loyaltyPoints')}
              </span>
            </div>
          </div>

          <button
            onClick={handleUseReward}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
            style={{
              fontFamily: "'Archivo', sans-serif",
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              boxShadow: '0 4px 12px rgba(6,182,212,0.2)',
            }}
          >
            {t('btnUseNow')}
          </button>
        </div>
      </div>
    </div>
  );
}

