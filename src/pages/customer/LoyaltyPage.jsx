import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loyaltyService } from '../../services/loyaltyService';
import PointSummary from '../../components/loyalty/PointSummary';
import PointBatchList from '../../components/loyalty/PointBatchList';
import PointHistoryTable from '../../components/loyalty/PointHistoryTable';
import RewardCard from '../../components/loyalty/RewardCard';
import { useLanguage } from '../../context/LanguageContext';

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' | 'history'
  
  // Data states
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [walletData, historyData, rewardsData] = await Promise.all([
          loyaltyService.getLoyaltyWallet(),
          loyaltyService.getPointHistory(),
          loyaltyService.getRewards(),
        ]);
        setWallet(walletData);
        setHistory(historyData);
        setRewards(rewardsData);
      } catch (error) {
        console.error("Failed to fetch loyalty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="space-y-4 w-full max-w-4xl px-6">
          <div className="h-48 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-12 rounded-xl bg-slate-200 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-64 rounded-xl bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const lockedTextParts = locale === 'en'
    ? ["You need at least ", " to unlock rewards. Book a wash to accumulate more!"]
    : ["Bạn cần tối thiểu ", " để mở khóa danh sách phần thưởng. Hãy đặt lịch rửa xe để tích lũy thêm nhé!"];

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.08) 0%, transparent 70%), #f8fafc',
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto h-auto px-6 sm:px-12 py-12">
        
        {/* Single Unified Loyalty Card Box */}
        <div
          className="w-full rounded-3xl border border-slate-200/80 animate-fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(6,182,212,0.04), 0 1px 3px rgba(0,0,0,0.02)',
            padding: '32px 24px',
          }}
        >
          {/* ── TOP: Summary ── */}
          <div style={{ marginBottom: '24px' }}>
            <PointSummary totalPoints={wallet?.totalPoints} canRedeem={wallet?.canRedeem} />
          </div>

          <hr className="border-slate-200/60" style={{ marginBottom: '24px' }} />

          {/* ── TABS ── */}
          <div className="w-full" style={{ marginBottom: '24px' }}>
            <div className="flex bg-slate-100 border border-slate-200/50 p-1.5 rounded-2xl w-full shadow-inner">
              {[
                { key: 'wallet', label: t('loyaltyTabWallet') },
                { key: 'history', label: t('loyaltyTabHistory') },
              ].map(tab => {
                const isSelected = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      flex-1 py-3 text-xs sm:text-sm font-bold transition-all duration-300 rounded-xl cursor-pointer text-center
                      ${isSelected
                        ? 'bg-white text-cyan-600 shadow-md font-extrabold'
                        : 'text-slate-500 hover:text-slate-800'
                      }
                    `}
                    style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '0.04em' }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── TAB CONTENT ── */}
          <div className="w-full pt-2">
            {activeTab === 'wallet' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Cột trái: Lô điểm */}
                <div className="lg:col-span-5 space-y-6">
                  <PointBatchList batches={wallet?.batches} />
                </div>

                {/* Cột phải: Rewards (BR-59: chỉ hiện nếu điểm >= 50) */}
                <div className="lg:col-span-7 flex flex-col">
                  <h3 
                    className="text-sm uppercase tracking-widest text-slate-500 mb-4"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                  >
                    {t('loyaltyAvailableRewards')}
                  </h3>
                  
                  {wallet?.totalPoints >= 50 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rewards.map(r => (
                        <RewardCard key={r.id} reward={r} />
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="flex-grow flex flex-col items-center justify-center py-10 px-6 border rounded-2xl text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.02) 0%, rgba(99, 102, 241, 0.02) 100%), #ffffff',
                        borderColor: '#e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.05), 0 8px 10px -6px rgba(6, 182, 212, 0.05)',
                      }}
                    >
                      {/* Glowing dynamic gradient top border */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-500" />
                      
                      {/* Animated Badge Container */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-50 to-orange-100 flex items-center justify-center mb-4 relative shadow-inner border border-amber-200/50">
                        {/* Soft pulsing ring */}
                        <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
                        <span className="text-3xl relative z-10">🎁</span>
                        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 text-[10px] flex items-center justify-center border border-white shadow">
                          <span className="material-symbols-outlined text-[12px] leading-none font-black">lock</span>
                        </span>
                      </div>

                      {/* Small Status Pill */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-extrabold uppercase tracking-wider mb-3" style={{ fontFamily: "'Archivo', sans-serif" }}>
                        {locale === 'en' ? 'Locked' : 'Chưa đủ điều kiện'}
                      </span>

                      <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-5" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                        {lockedTextParts[0]}
                        <strong className="text-cyan-600 font-extrabold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100 mx-1">{locale === 'en' ? '50 points' : '50 điểm'}</strong>
                        {lockedTextParts[1]}
                      </p>

                      <button 
                        onClick={() => navigate('/booking')}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-95 cursor-pointer shadow-md inline-block"
                        style={{
                          fontFamily: "'Archivo', sans-serif",
                          color: '#ffffff',
                          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
                          border: 'none',
                        }}
                      >
                        {locale === 'en' ? 'Book a wash now' : 'Đặt lịch rửa xe tích điểm ngay'}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

            {activeTab === 'history' && (
              <PointHistoryTable history={history} />
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
