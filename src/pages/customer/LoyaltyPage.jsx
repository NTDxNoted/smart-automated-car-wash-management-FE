import React, { useState, useEffect } from 'react';
import { loyaltyService } from '../../services/loyaltyService';
import PointSummary from '../../components/loyalty/PointSummary';
import PointBatchList from '../../components/loyalty/PointBatchList';
import PointHistoryTable from '../../components/loyalty/PointHistoryTable';
import RewardCard from '../../components/loyalty/RewardCard';
import { useLanguage } from '../../context/LanguageContext';

export default function LoyaltyPage() {
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
      className="min-h-screen flex flex-col items-center"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.1) 0%, transparent 70%), #f8fafc',
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* Navbar Spacer */}
      <div className="h-16 w-full block shrink-0" aria-hidden="true" />

      <div className="w-full max-w-4xl mx-auto h-auto px-6 py-8 space-y-8">
        
        {/* ── TOP: Summary ── */}
        <PointSummary totalPoints={wallet?.totalPoints} canRedeem={wallet?.canRedeem} />

        {/* ── TABS ── */}
        <div
          className="flex h-12 rounded-xl border border-slate-200 overflow-hidden"
          style={{ background: '#ffffff' }}
        >
          {[
            { key: 'wallet', label: t('loyaltyTabWallet') },
            { key: 'history', label: t('loyaltyTabHistory') },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 py-3 text-sm font-semibold transition-all duration-200
                ${activeTab === tab.key
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700'
                }
              `}
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '0.05em' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cột trái: Lô điểm */}
            <div className="lg:col-span-5 space-y-6">
              <PointBatchList batches={wallet?.batches} />
            </div>

            {/* Cột phải: Rewards (BR-59: chỉ hiện nếu điểm >= 50) */}
            <div className="lg:col-span-7">
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
                <div className="h-full flex flex-col items-center justify-center py-12 border border-slate-200 rounded-2xl bg-white">
                  <span className="text-4xl opacity-50 mb-3">🎁</span>
                  <p className="text-slate-500 text-sm px-6 text-center" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {lockedTextParts[0]}
                    <strong className="text-slate-800">{locale === 'en' ? '50 points' : '50 điểm'}</strong>
                    {lockedTextParts[1]}
                  </p>
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
  );
}
