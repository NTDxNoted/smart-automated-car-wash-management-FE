import { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import TierBadge from '../../components/profile/TierBadge';
import TierProgressBar from '../../components/profile/TierProgressBar';
import VehicleList from '../../components/profile/VehicleList';

export default function ProfilePage() {
  const { auth, setAuth } = useAuth();
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { key: 'info', label: t('profileTabInfo') },
    { key: 'vehicles', label: t('profileTabVehicles') },
  ];

  const formatVND = (amount) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getTierName = (tier) => {
    const tStr = String(tier !== undefined && tier !== null ? tier : '').trim().toUpperCase();
    if (tStr === '4' || tStr === 'PLATINUM') return 'Platinum';
    if (tStr === '3' || tStr === 'GOLD') return 'Gold';
    if (tStr === '2' || tStr === 'SILVER') return 'Silver';
    return 'Member';
  };

  // Profile state
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit fullName
  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Fetch profile ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingProfile(true);
        const data = await profileService.getProfile();
        setProfile(data);
        setNameInput(data.fullName);
      } catch {
        // Có thể thêm toast lỗi nếu cần
      } finally {
        setLoadingProfile(false);
      }
    };
    fetch();
  }, []);

  // ── Lưu fullName ────────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setSaveError(t('profileNameRequired'));
      return;
    }
    if (nameInput.trim() === profile.fullName) {
      setEditMode(false);
      return;
    }
    setSaveError('');
    try {
      setSaving(true);
      const result = await profileService.updateProfile({ fullName: nameInput.trim() });
      // Cập nhật local profile state
      setProfile(prev => ({ ...prev, fullName: result.fullName }));
      // Cập nhật AuthContext để header/nav hiển thị đúng tên mới
      setAuth({ ...auth, fullName: result.fullName });
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError(t('profileUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNameInput(profile?.fullName ?? '');
    setSaveError('');
    setEditMode(false);
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="space-y-3 w-full max-w-md px-6">
          {[80, 120, 60, 100].map((h, i) => (
            <div key={i} className="rounded-xl bg-slate-200 animate-pulse" style={{ height: h }} />
          ))}
        </div>
      </div>
    );
  }

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
        
        {/* Single Unified Profile Box */}
        <div
          className="w-full rounded-3xl border border-slate-200/80 space-y-8 animate-fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(6,182,212,0.04), 0 1px 3px rgba(0,0,0,0.02)',
            padding: '32px 24px',
          }}
        >
          {/* Top Row: Avatar + Name + Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8" style={{ marginBottom: '24px' }}>
            
            {/* Left: Avatar & User identity */}
            <div className="flex items-center gap-6">
              {/* Glowing Avatar Initials */}
              <div
                className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-3xl font-black text-white relative group"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #4f46e5 100%)',
                  boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.35)',
                  fontFamily: "'Archivo', sans-serif",
                }}
              >
                <div className="absolute inset-0.5 rounded-[22px] bg-black/10 transition-opacity group-hover:opacity-0" />
                <span className="relative z-10">{profile?.fullName?.charAt(0)?.toUpperCase() ?? '?'}</span>
              </div>

              {/* Name and status badge */}
              <div className="space-y-2.5 min-w-0">
                {/* Tier badge */}
                <div>
                  <TierBadge tier={profile?.tier} size="sm" />
                </div>

                {/* Name & Editing */}
                {!editMode ? (
                  <div className="flex items-center gap-3">
                    <h1
                      className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight truncate leading-tight"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      {profile?.fullName || '---'}
                    </h1>
                    <button
                      onClick={() => { setEditMode(true); setNameInput(profile?.fullName ?? ''); setSaveError(''); }}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 transition-all flex items-center justify-center border border-slate-200/50 hover:border-cyan-200 active:scale-90 flex-shrink-0 cursor-pointer"
                      title={t('profileEditName')}
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 max-w-md">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={e => { setNameInput(e.target.value); setSaveError(''); }}
                        className="flex-grow bg-white border-2 border-cyan-500 rounded-xl px-4 py-2 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-inner"
                        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelEdit(); }}
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={saving}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-50 transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', fontFamily: "'Archivo', sans-serif" }}
                      >
                        {saving ? '...' : t('btnSave')}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2.5 rounded-xl text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                      >
                        {t('btnCancel')}
                      </button>
                    </div>
                    {saveError && (
                      <p className="text-red-500 text-xs font-medium">{saveError}</p>
                    )}
                  </div>
                )}

                {/* SĐT and info status */}
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <span className="material-symbols-outlined text-slate-400 text-lg leading-none">phone_iphone</span>
                  <span>{profile?.phone || '---'}</span>
                </div>

                {/* Save success toast inline */}
                {saveSuccess && (
                  <p className="text-cyan-600 text-xs font-bold flex items-center gap-1 animate-pulse">
                    <span>✓</span> {t('profileUpdateSuccess')}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Premium Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto min-w-0 lg:max-w-md flex-grow">
              {/* Spending stat widget */}
              <div
                className="rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-slate-300/80"
                style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl font-bold">payments</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    {t('profileTotalSpending')}
                  </p>
                  <p className="text-lg font-black text-slate-800 tracking-tight leading-none truncate" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    {formatVND(profile?.totalSpending)}
                  </p>
                </div>
              </div>

              {/* Loyalty Points stat widget */}
              <div
                className="rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-slate-300/80"
                style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl font-bold">stars</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    {t('profilePoints')}
                  </p>
                  <p className="text-lg font-black text-amber-600 tracking-tight leading-none truncate" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    {profile?.loyaltyPoints?.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN') || 0} <span className="text-[11px] font-bold text-slate-400 lowercase tracking-normal">{t('loyaltyPoints')}</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Tier progress bar */}
          <div className="w-full" style={{ marginBottom: '24px' }}>
            <TierProgressBar tier={profile?.tier} totalSpending={profile?.totalSpending} />
          </div>

          <hr className="border-slate-200/60" style={{ marginBottom: '24px' }} />

          {/* Tab Selection Header */}
          <div className="w-full" style={{ marginBottom: '24px' }}>
            <div className="flex bg-slate-100 border border-slate-200/50 p-1.5 rounded-2xl w-full shadow-inner">
              {tabs.map(tab => {
                const isSelected = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      flex-1 py-4 text-sm sm:text-base md:text-lg font-bold transition-all duration-300 rounded-xl cursor-pointer text-center
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

          {/* Tab Content Area */}
          <div className="w-full pt-2">
            {activeTab === 'info' && (
              <div className="space-y-6 w-full">
                <h2
                  className="text-sm uppercase tracking-widest text-slate-500 text-center font-bold mb-2"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  {t('profileAccountInfo')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      label: t('profileCustomerId'), 
                      value: profile?.customerId || '---', 
                      icon: 'fingerprint',
                      color: 'bg-cyan-500/10 text-cyan-600',
                      desc: locale === 'en' ? 'Your unique identifier on the system.' : 'Mã định danh duy nhất của bạn trên hệ thống.'
                    },
                    { 
                      label: t('profileFullName'), 
                      value: profile?.fullName || '---', 
                      icon: 'person',
                      color: 'bg-indigo-500/10 text-indigo-600',
                      desc: locale === 'en' ? 'Your registered full name.' : 'Họ và tên đăng ký sử dụng dịch vụ.'
                    },
                    { 
                      label: t('profilePhone'), 
                      value: profile?.phone || '---', 
                      icon: 'phone_iphone',
                      color: 'bg-emerald-500/10 text-emerald-600',
                      note: t('profilePhoneNote'),
                      desc: locale === 'en' ? 'Phone number used for login and contact.' : 'Số điện thoại dùng để đăng nhập và liên hệ.'
                    },
                    { 
                      label: t('profileTier'), 
                      value: getTierName(profile?.tier), 
                      icon: 'workspace_premium',
                      color: 'bg-amber-500/10 text-amber-600',
                      desc: locale === 'en' ? 'Your current loyalty membership rank.' : 'Hạng thành viên hiện tại của tài khoản.'
                    },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-300/80"
                      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', marginBottom: '5px' }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                          <span className="material-symbols-outlined text-2xl font-bold">{item.icon}</span>
                        </div>
                        <div className="space-y-1 min-w-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                            {item.label}
                          </p>
                          <div className="text-base font-bold text-slate-800 tracking-tight leading-tight truncate" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                            {item.value}
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      {item.note && (
                        <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                          <span className="material-symbols-outlined text-sm leading-none">lock</span>
                          <span>{item.note}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="w-full">
                <VehicleList />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

