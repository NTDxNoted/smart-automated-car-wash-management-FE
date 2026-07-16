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
      className="group relative rounded-2xl border border-slate-200/80 p-4 sm:p-5 transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:-translate-y-1 bg-white"
    >
      {/* Glow on hover */}
      <div 
        className="absolute inset-0 rounded-2xl bg-cyan-500/0 group-hover:bg-cyan-500/[0.02] transition-colors duration-300 pointer-events-none" 
      />

      <div className="flex flex-col h-full gap-4 relative z-10">
        {/* Top section: Title/Value & Icon Box */}
        <div className="flex items-start justify-between">
          <div>
            <h4 
              className="text-2xl font-black text-cyan-600 tracking-tight group-hover:text-cyan-700 transition-colors"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              {reward.name}
            </h4>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-wider">
              VOUCHER ƯU ĐÃI
            </p>
          </div>
          
          {/* Icon Box in Top-Right */}
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-cyan-50 group-hover:border-cyan-100 transition-all duration-300">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-cyan-600 transition-colors text-lg">
              local_activity
            </span>
          </div>
        </div>

        {/* Middle Section: Perfect Dashed Divider with aligned Cutouts */}
        <div className="relative my-1">
          {/* Cutout left */}
          <div className="absolute -left-[24px] sm:-left-[28px] top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 border-r border-slate-200/80 rounded-full z-20" />
          {/* Cutout right */}
          <div className="absolute -right-[24px] sm:-right-[28px] top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 border-l border-slate-200/80 rounded-full z-20" />
          {/* Dashed line */}
          <div className="border-t-2 border-dashed border-slate-100" />
        </div>

        {/* Bottom section: Points Required & Use Now Button */}
        <div className="flex items-end justify-between mt-1 gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              CẦN TÍCH LŨY
            </span>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-2xl font-black text-slate-800 leading-none"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {reward.pointsRequired}
              </span>
              <span className="text-xs font-extrabold text-cyan-600 uppercase tracking-wide leading-none">
                {t('loyaltyPoints')}
              </span>
            </div>
          </div>

          <button
            onClick={handleUseReward}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-95 cursor-pointer flex-shrink-0"
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

